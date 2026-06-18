import { Graph } from '../utils/knowledge-graph'
import {
  shortestPath,
  personalizedPageRank,
  louvainCommunityDetection,
  pageRank,
  betweennessCentrality
} from '../utils/graph-algorithms'

/**
 * Composable สำหรับจัดการการ Query และวิเคราะห์ข้อมูลใน Knowledge Graph
 */
export const useGraphQuery = () => {
  // สร้าง instance ของ Graph และสร้างข้อมูลตั้งต้นจาก Mock Data
  // ใช้ shallowRef แทน ref เพื่อป้องกัน Vue ไม่ให้ทำ Deep Proxy กับ Class Instance
  // ซึ่งจะช่วยรักษา Private properties/methods (getSymbolSize, getNodeColor) ให้ TypeScript ตรวจสอบได้
  // และช่วยลดภาระการประมวลผลสำหรับโครงสร้างข้อมูลขนาดใหญ่
  const graph = shallowRef<Graph>(new Graph().buildGraph())

  /**
   * findPath(researcherA, researcherB) — ค้นหาเส้นทางความร่วมมือที่สั้นที่สุด
   */
  const findPath = (researcherA: string, researcherB: string) => {
    return shortestPath(graph.value, researcherA, researcherB)
  }

  /**
   * getRecommendations(researcherId, options) — แนะนำนักวิจัย/กลุ่ม/MOU ที่เกี่ยวข้อง
   * ใช้ Personalized PageRank เพื่อหาโหนดที่มีความสัมพันธ์ใกล้ชิดกับโหนดเป้าหมาย
   */
  const getRecommendations = (researcherId: string, options: { topN?: number } = {}) => {
    const { topN = 5 } = options
    const scores = personalizedPageRank(graph.value, [researcherId])
    
    return Object.entries(scores)
      .filter(([id]) => id !== researcherId)
      .map(([id, score]) => ({
        id,
        score,
        node: graph.value.nodes.get(id)
      }))
      .filter(item => item.node && ['Researcher', 'Group', 'MOU'].includes(item.node.type))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
  }

  /**
   * getCommunityGraph() — ดึงข้อมูลกราฟพร้อมข้อมูลการแบ่งกลุ่มชุมชน (Community)
   */
  const getCommunityGraph = () => {
    const communities = louvainCommunityDetection(graph.value)
    const echartsData = graph.value.toEChartsData()
    
    const nodes = echartsData.nodes.map(node => {
      return {
        ...node,
        community: communities[node.id]
      }
    })

    return { ...echartsData, nodes }
  }

  /**
   * getCentralNodes(metric, topN) — ค้นหาโหนดที่มีความสำคัญสูงตาม Metric ที่ระบุ
   * รองรับ 'pagerank' (ความมีอิทธิพล) และ 'betweenness' (การเป็นตัวกลางเชื่อมกลุ่ม)
   */
  const getCentralNodes = (metric: 'pagerank' | 'betweenness' = 'pagerank', topN: number = 10) => {
    const scores = metric === 'pagerank' 
      ? pageRank(graph.value) 
      : betweennessCentrality(graph.value)

    return Object.entries(scores)
      .map(([id, score]) => ({
        id,
        score,
        node: graph.value.nodes.get(id)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
  }

  /**
   * searchGraph(query) — ค้นหาโหนดแบบ Graph-aware โดยอิงจาก Label หรือ ID
   */
  const searchGraph = (query: string) => {
    const q = query.toLowerCase()
    return Array.from(graph.value.nodes.values()).filter(node => 
      node.label.toLowerCase().includes(q) || 
      node.id.toLowerCase().includes(q)
    )
  }

  /**
   * getSubgraphByTheme(theme) — ดึงกราฟย่อยที่เกี่ยวข้องกับ Theme ที่ระบุ
   */
  const getSubgraphByTheme = (theme: string) => {
    const relevantIds = new Set<string>()
    
    if (graph.value.nodes.has(theme)) relevantIds.add(theme)

    for (const [id, node] of graph.value.nodes) {
      // ตรวจสอบความเชื่อมโยงทั้งจากข้อมูลคุณสมบัติ และความสัมพันธ์ในกราฟ
      const isThemeAligned = node.data?.theme === theme || 
                             (Array.isArray(node.data?.themes) && node.data.themes.includes(theme))
      const isNeighbor = graph.value.getNeighbors(id).includes(theme)

      if (isThemeAligned || isNeighbor) {
        relevantIds.add(id)
      }
    }

    return graph.value.getSubgraph(Array.from(relevantIds))
  }

  return {
    graph,
    findPath,
    getRecommendations,
    getCommunityGraph,
    getCentralNodes,
    searchGraph,
    getSubgraphByTheme
  }
}
