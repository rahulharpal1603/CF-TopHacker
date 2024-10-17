const TIMEOUT = 45 * 1000;  // 45 seconds

class Cache {
  constructor() {
    this.map = new Map();
    this.timeIds = new Map(); 
  }

  getOr(contestId, responsePromiseGen) {
    if (!this.map.has(contestId)) {
      this.map.set(contestId, responsePromiseGen());
      const id = setTimeout(() => void this.map.delete(contestId), TIMEOUT);
      this.timeIds.set(contestId, id);
    } else {
      
      // update cached value in the background
      responsePromiseGen().then((res) => {
        this.map.set(contestId, res);  // Update cache with new result
      }).catch((err) => {
        // keep cached value
        console.error(`Failed to refresh cache for ${contestId}:`, err);  
      }).finally(() => {
        clearTimeout(this.timeIds.get(contestId));
        const id = setTimeout(() => void this.map.delete(contestId), TIMEOUT);
        this.timeIds.set(contestId, id);
      });

    }
    return this.map.get(contestId); // Return the cached value immediately
  }
}
