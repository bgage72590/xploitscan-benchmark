// Adapted from OWASP/NodeGoat app/data/allocations-dao.js (Apache-2.0). See NOTICE.
function AllocationsDAO (db) {
  this.search = (userId, threshold, callback) => {
    const parsedUserId = parseInt(userId, 10);
    const query = { $where: `this.userId == ${parsedUserId} && this.stocks > '${threshold}'` };
    db.collection('allocations').find(query).toArray(callback);
  };
}
module.exports = AllocationsDAO;
