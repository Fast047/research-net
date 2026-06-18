import { RESEARCHERS, GROUPS, MOUS, PROJECTS, WORKS, THEMES } from './mockData';
import { TC } from './index';

export type NodeType = 'Researcher' | 'Group' | 'MOU' | 'Project' | 'Work' | 'Institution' | 'Theme' | 'Keyword';
export type EdgeType = 'MEMBER_OF' | 'LEADS' | 'PARTICIPATES_IN' | 'HAS_MOU' | 'PRODUCED_WORK' | 'COLLABORATES_WITH' | 'EXPERT_IN' | 'ALIGNED_WITH';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  data: any;
}

export interface GraphEdge {
  fromId: string;
  toId: string;
  type: EdgeType;
  weight: number;
}

export class Graph {
  nodes: Map<string, GraphNode> = new Map();
  edges: GraphEdge[] = [];

  /**
   * เพิ่ม Node เข้าสู่ระบบ Graph
   */
  addNode(id: string, type: NodeType, data: any) {
    this.nodes.set(id, {
      id,
      type,
      label: data.name || data.title || data.inst || id,
      data
    });
    return this;
  }

  /**
   * เพิ่ม Edge เชื่อมโยงระหว่าง Node
   */
  addEdge(fromId: string, toId: string, type: EdgeType, weight: number = 1) {
    this.edges.push({ fromId, toId, type, weight });
    return this;
  }

  /**
   * หา Node ที่เชื่อมต่อกับ ID ที่ระบุ
   */
  getNeighbors(id: string): string[] {
    const neighbors = new Set<string>();
    for (const edge of this.edges) {
      if (edge.fromId === id) neighbors.add(edge.toId);
      if (edge.toId === id) neighbors.add(edge.fromId);
    }
    return Array.from(neighbors);
  }

  /**
   * หาเส้นทางระหว่าง Node สองจุดโดยใช้ BFS
   */
  findPath(from: string, to: string): string[] | null {
    if (!this.nodes.has(from) || !this.nodes.has(to)) return null;
    
    const queue: [string, string[]][] = [[from, [from]]];
    const visited = new Set<string>([from]);

    while (queue.length > 0) {
      const [current, path] = queue.shift()!;
      if (current === to) return path;

      for (const neighbor of this.getNeighbors(current)) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([neighbor, [...path, neighbor]]);
        }
      }
    }
    return null;
  }

  /**
   * ดึงกราฟย่อยจากกลุ่ม IDs ที่ระบุ
   */
  getSubgraph(ids: string[]) {
    const idSet = new Set(ids);
    const nodes = Array.from(this.nodes.values()).filter(n => idSet.has(n.id));
    const edges = this.edges.filter(e => idSet.has(e.fromId) && idSet.has(e.toId));
    return { nodes, edges };
  }

  /**
   * แปลงข้อมูลให้อยู่ในรูปแบบที่ ECharts Force Graph ใช้งานได้
   */
  toEChartsData() {
    const categories = [
      'Researcher', 'Group', 'MOU', 'Project', 'Work', 'Institution', 'Theme', 'Keyword'
    ].map(name => ({ name }));

    const typeToIndex: Record<string, number> = {
      Researcher: 0, Group: 1, MOU: 2, Project: 3, Work: 4, Institution: 5, Theme: 6, Keyword: 7
    };

    // console.log('nodes', this.nodes);

    const nodes = Array.from(this.nodes.values()).map(n => ({
      id: n.id,
      name: n.label,
      category: typeToIndex[n.type],
      dataType: n.type,
      dataTheme: n.data?.theme || n.data?.themes || null,
      symbolSize: this.getSymbolSize(n.type),
      itemStyle: {
        color: this.getNodeColor(n)
      },
      label: {
        show: ['Theme', 'Group', 'Researcher', 'Institution'].includes(n.type)
      }
    }));

    const links = this.edges.map(e => ({
      source: e.fromId,
      target: e.toId,
      value: e.weight,
      lineStyle: {
        curveness: 0.1
      }
    }));

    return { nodes, links, categories };
  }

  private getSymbolSize(type: NodeType): number {
    const sizes: Record<NodeType, number> = {
      Theme: 50, Group: 35, MOU: 30, Institution: 30, Researcher: 25, Project: 20, Work: 12, Keyword: 10
    };
    return sizes[type] || 15;
  }

  private getNodeColor(node: GraphNode): string {
    const themeId = node.type === 'Theme' ? node.id : (node.data?.theme || node.data?.themes?.[0] || null);
    if (themeId) return TC(themeId);
    return node.type === 'Institution' ? '#64748b' : node.type === 'Keyword' ? '#94a3b8' : '#cbd5e1';
  }

  /**
   * สร้าง Graph จากข้อมูลจำลอง (Mock Data)
   */
  buildGraph() {
    // 1. Themes & Institutions
    Object.keys(THEMES).forEach(k => this.addNode(k, 'Theme', { name: THEMES[k].name }));
    const institutions = new Set([...RESEARCHERS.map(r => r.inst), ...GROUPS.map(g => g.inst), ...MOUS.map(m => m.inst)]);
    institutions.forEach(inst => inst && this.addNode(inst, 'Institution', { name: inst }));

    // 2. Researchers
    RESEARCHERS.forEach(r => {
      this.addNode(r.id, 'Researcher', r);
      if (r.inst) this.addEdge(r.id, r.inst, 'MEMBER_OF');
      r.themes.forEach(t => this.addEdge(r.id, t, 'EXPERT_IN'));
      r.expertise.forEach(exp => {
        const kwId = `kw-${exp}`;
        if (!this.nodes.has(kwId)) this.addNode(kwId, 'Keyword', { name: exp });
        this.addEdge(r.id, kwId, 'EXPERT_IN');
      });
      r.collab_ids.forEach(cid => this.addEdge(r.id, cid, 'COLLABORATES_WITH'));
    });

    // 3. Groups, MOUs, Projects & Works
    GROUPS.forEach(g => {
      this.addNode(g.id, 'Group', g);
      if (g.theme) this.addEdge(g.id, g.theme, 'ALIGNED_WITH');
      if (g.lead) this.addEdge(g.lead, g.id, 'LEADS');
      g.members.forEach(mId => this.addEdge(mId, g.id, 'MEMBER_OF'));
      g.mou_ids.forEach(mouId => this.addEdge(g.id, mouId, 'HAS_MOU'));
    });

    MOUS.forEach(m => this.addNode(m.id, 'MOU', m).addEdge(m.id, m.theme, 'ALIGNED_WITH'));
    PROJECTS.forEach(p => {
      this.addNode(p.id, 'Project', p).addEdge(p.pi, p.id, 'PARTICIPATES_IN').addEdge(p.id, p.theme, 'ALIGNED_WITH');
      if (p.mou_id) this.addEdge(p.id, p.mou_id, 'ALIGNED_WITH');
    });
    WORKS.forEach(w => this.addNode(w.id, 'Work', { name: w.title, ...w }).addEdge(w.researcher, w.id, 'PRODUCED_WORK').addEdge(w.id, w.theme, 'ALIGNED_WITH'));

    return this;
  }
}