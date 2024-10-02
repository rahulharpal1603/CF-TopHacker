const TIMEOUT = 45 * 1000;  // 45 seconds

class Cache {
  constructor() {
    this.map = new Map();
  }

  getOr(contestId, responsePromiseGen) {
    if (!this.map.has(contestId)) {
      this.map.set(contestId, responsePromiseGen() );
      setTimeout(() => void this.map.delete(contestId), TIMEOUT);
    }
    return this.map.get(contestId);
  }
}
