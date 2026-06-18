import type { Graph } from './knowledge-graph';

/**
 * ค้นหาเส้นทางที่สั้นที่สุดระหว่าง Node สองจุดโดยใช้ Breadth-First Search (BFS)
 * เรียกใช้เมธอด findPath จากคลาส Graph โดยตรง
 */
export function shortestPath(graph: Graph, from: string, to: string): string[] | null {
  return graph.findPath(from, to);
}

/**
 * คำนวณค่า Jaccard Similarity ระหว่าง Node สองจุด
 * ใช้สำหรับวัดความคล้ายคลึงกันของความเชี่ยวชาญหรือกลุ่มความร่วมมือ (Neighbor Overlap)
 */
export function jaccardSimilarity(graph: Graph, nodeA: string, nodeB: string): number {
  const neighborsA = new Set(graph.getNeighbors(nodeA));
  const neighborsB = new Set(graph.getNeighbors(nodeB));
  
  if (neighborsA.size === 0 && neighborsB.size === 0) return 0;
  
  let intersectionSize = 0;
  for (const neighbor of neighborsA) {
    if (neighborsB.has(neighbor)) intersectionSize++;
  }
  
  const unionSize = new Set([...neighborsA, ...neighborsB]).size;
  return intersectionSize / unionSize;
}

/**
 * PageRank Algorithm เพื่อจัดอันดับความสำคัญของ Nodes ในระบบ
 * เหมาะสำหรับหา "ศูนย์กลางความรู้" หรือ "นักวิจัยผู้ทรงอิทธิพล" ในเครือข่าย
 */
export function pageRank(
  graph: Graph, 
  iterations: number = 20, 
  damping: number = 0.85
): Record<string, number> {
  const nodeIds = Array.from(graph.nodes.keys());
  const N = nodeIds.length;
  if (N === 0) return {};

  let ranks: Record<string, number> = {};
  nodeIds.forEach(id => ranks[id] = 1 / N);

  for (let i = 0; i < iterations; i++) {
    const nextRanks: Record<string, number> = {};
    let sinkRank = 0;

    nodeIds.forEach(id => nextRanks[id] = (1 - damping) / N);

    for (const id of nodeIds) {
      const neighbors = graph.getNeighbors(id);
      if (neighbors.length > 0) {
        const share = ((ranks[id] ?? 0) * damping) / neighbors.length;
        neighbors.forEach(neighborId => {
          nextRanks[neighborId] = (nextRanks[neighborId] ?? 0) + share;
        });
      } else {
        // จัดการกับ Sink Node (Node ที่ไม่มีขาออก) โดยกระจายคะแนนคืนสู่ระบบ
        sinkRank += ((ranks[id] ?? 0) * damping) / N;
      }
    }

    nodeIds.forEach(id => nextRanks[id] = (nextRanks[id] ?? 0) + sinkRank);
    ranks = nextRanks;
  }

  return ranks;
}

/**
 * Personalized PageRank (PPR) แนะนำ Nodes ที่เกี่ยวข้องกับกลุ่มเป้าหมาย (Seed Nodes)
 * ใช้สำหรับระบบ Recommendation เช่น "นักวิจัยที่ควรทำ MOU ด้วย" โดยอิงจากประวัติเดิม
 */
export function personalizedPageRank(
  graph: Graph, 
  seedNodes: string[], 
  iterations: number = 20, 
  damping: number = 0.85
): Record<string, number> {
  const nodeIds = Array.from(graph.nodes.keys());
  const N = nodeIds.length;
  if (N === 0 || seedNodes.length === 0) return {};

  const seeds = new Set(seedNodes);
  let ranks: Record<string, number> = {};
  nodeIds.forEach(id => ranks[id] = seeds.has(id) ? 1 / seedNodes.length : 0);

  for (let i = 0; i < iterations; i++) {
    const nextRanks: Record<string, number> = {};
    nodeIds.forEach(id => nextRanks[id] = 0);
    
    let sinkRank = 0;

    for (const id of nodeIds) {
      const neighbors = graph.getNeighbors(id);
      if (neighbors.length > 0) {
        const share = ((ranks[id] ?? 0) * damping) / neighbors.length;
        neighbors.forEach(neighborId => {
          nextRanks[neighborId] = (nextRanks[neighborId] ?? 0) + share;
        });
      } else {
        sinkRank += ((ranks[id] ?? 0) * damping);
      }
    }

    // Teleportation กลับไปยังกลุ่ม Seed Nodes เท่านั้น
    nodeIds.forEach(id => {
      if (seeds.has(id)) {
        nextRanks[id] = (nextRanks[id] ?? 0) + (1 - damping) / seedNodes.length + (sinkRank / seedNodes.length);
      }
    });

    ranks = nextRanks;
  }

  return ranks;
}

/**
 * Betweenness Centrality (Brandes' Algorithm)
 * ใช้หา Nodes ที่เป็น "สะพานเชื่อม" (Broker) ระหว่างกลุ่มวิจัยต่างๆ ในโครงข่าย
 */
export function betweennessCentrality(graph: Graph): Record<string, number> {
  const nodeIds = Array.from(graph.nodes.keys());
  const centrality: Record<string, number> = {};
  nodeIds.forEach(id => centrality[id] = 0);

  for (const s of nodeIds) {
    const stack: string[] = [];
    const predecessors: Record<string, string[]> = {};
    const sigma: Record<string, number> = {};
    const distance: Record<string, number> = {};
    
    nodeIds.forEach(id => {
      predecessors[id] = [];
      sigma[id] = 0;
      distance[id] = -1;
    });

    sigma[s] = 1;
    distance[s] = 0;
    const queue: string[] = [s];

    while (queue.length > 0) {
      const v = queue.shift()!;
      stack.push(v);
      for (const w of graph.getNeighbors(v)) {
        const distW = distance[w] ?? -1;
        if (distW < 0) {
          queue.push(w);
          distance[w] = (distance[v] ?? 0) + 1;
        }
        if (distance[w] === (distance[v] ?? 0) + 1) {
          sigma[w] = (sigma[w] ?? 0) + (sigma[v] ?? 0);
          predecessors[w]?.push(v);
        }
      }
    }

    const dependency: Record<string, number> = {};
    nodeIds.forEach(id => dependency[id] = 0);

    while (stack.length > 0) {
      const w = stack.pop()!;
      for (const v of (predecessors[w] ?? [])) {
        const sigV = sigma[v] ?? 0;
        const sigW = sigma[w] ?? 1; // กันหารด้วยศูนย์
        const depW = dependency[w] ?? 0;
        dependency[v] = (dependency[v] ?? 0) + (sigV / sigW) * (1 + depW);
      }
      if (w !== s) centrality[w] = (centrality[w] ?? 0) + (dependency[w] ?? 0);
    }
  }

  // Normalize สำหรับกราฟแบบ Undirected: 2 / ((n-1)(n-2))
  const n = nodeIds.length;
  if (n > 2) {
    const factor = 2 / ((n - 1) * (n - 2));
    for (const id in centrality) centrality[id] = (centrality[id] ?? 0) * factor;
  }

  return centrality;
}

/**
 * ตรวจจับชุมชน (Community Detection) โดยใช้หลักการ Label Propagation
 * ใช้สำหรับแบ่งกลุ่มนักวิจัยหรือโครงการออกเป็น "ชุมชนย่อย" ที่มีความหนาแน่นของการเชื่อมโยงสูง
 */
export function louvainCommunityDetection(graph: Graph): Record<string, number> {
  const nodeIds = Array.from(graph.nodes.keys());
  const communities: Record<string, number> = {};
  
  // เริ่มต้นโดยให้แต่ละ Node อยู่ในชุมชนของตัวเอง
  nodeIds.forEach((id, i) => communities[id] = i);

  let improved = true;
  let maxPasses = 15;

  while (improved && maxPasses-- > 0) {
    improved = false;
    // สุ่มลำดับ Nodes เพื่อลดอคติในการจัดกลุ่ม
    const shuffled = [...nodeIds].sort(() => Math.random() - 0.5);

    for (const id of shuffled) {
      const neighbors = graph.getNeighbors(id);
      if (neighbors.length === 0) continue;

      const counts: Record<number, number> = {};
      neighbors.forEach(neighborId => {
        const comm = communities[neighborId];
        if (comm !== undefined) {
          counts[comm] = (counts[comm] ?? 0) + 1;
        }
      });

      let bestComm = communities[id] ?? 0;
      let maxWeight = counts[bestComm] ?? 0;

      for (const [commStr, weight] of Object.entries(counts)) {
        const comm = Number(commStr);
        if (weight > (maxWeight ?? 0)) {
          maxWeight = weight;
          bestComm = comm;
          improved = true;
        }
      }
      communities[id] = bestComm;
    }
  }

  return communities;
}

/**
 * คำนวณความหนาแน่นของกราฟ (Graph Density)
 */
export function getGraphDensity(graph: Graph): number {
  const n = graph.nodes.size;
  if (n < 2) return 0;
  const e = graph.edges.length;
  // คำนวณแบบ Undirected Graph: 2E / (V * (V-1))
  return (2 * e) / (n * (n - 1));
}

/**
 * คำนวณค่าเฉลี่ย Clustering Coefficient ของกราฟ
 * เพื่อใช้วัดความเกาะกลุ่มของเครือข่าย
 */
export function getAverageClusteringCoefficient(graph: Graph): number {
  const nodeIds = Array.from(graph.nodes.keys());
  let totalCC = 0;
  let validNodes = 0;

  for (const id of nodeIds) {
    const neighbors = graph.getNeighbors(id);
    if (neighbors.length < 2) continue;

    const neighborSet = new Set(neighbors);
    let actualEdges = 0;

    // นับจำนวนเส้นเชื่อมระหว่างเพื่อนบ้านด้วยกันเอง
    for (let i = 0; i < neighbors.length; i++) {
      const u = neighbors[i] as any;
      const uNeighbors = graph.getNeighbors(u);
      for (const v of uNeighbors) {
        if (neighborSet.has(v) && neighbors.indexOf(v) > i) {
          actualEdges++;
        }
      }
    }

    const possibleEdges = (neighbors.length * (neighbors.length - 1)) / 2;
    totalCC += actualEdges / possibleEdges;
    validNodes++;
  }

  return validNodes === 0 ? 0 : totalCC / validNodes;
}
