const db = require("../db");
module.exports = function adminAudit(req, res, next) {
  if (!["POST", "PUT", "PATCH", "DELETE"].includes(req.method)) return next();
  const resource = req.path.split("?")[0].slice(0, 200);
  res.once("finish", () => {
    const actor =
      req.auditActor || (req.user?.role === "admin" ? req.user : null);
    if (!actor && resource !== "/login") return;
    db.query(
      `INSERT INTO admin_audit_logs (admin_id,admin_email,method,resource,status_code) VALUES (?,?,?,?,?)`,
      [
        actor?.id || null,
        actor?.email || null,
        req.method,
        resource,
        res.statusCode,
      ],
    ).catch((error) =>
      console.error("Admin audit write failed:", error.code || error.message),
    );
  });
  next();
};
