namespace azure_portal_api.Models
{
    public class AuditLog
    {
        public string AuditLogId { get; set; } = Guid.NewGuid().ToString();
        public string Actor { get; set; } = string.Empty; // User email or system
        public string Action { get; set; } = string.Empty; // login, add_tile, remove_tile, etc.
        public string? Target { get; set; } // Target resource or user
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public string Result { get; set; } = "success"; // success, failure
        public string? Details { get; set; } // JSON for additional context
    }
}

