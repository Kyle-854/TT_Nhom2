using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class AuditLog
{
    public long AuditId { get; set; }

    public string? EntityName { get; set; }

    public string? EntityId { get; set; }

    public string Action { get; set; } = null!;

    public long? PerformedBy { get; set; }

    public DateTimeOffset PerformedAt { get; set; }

    public string? DataBefore { get; set; }

    public string? DataAfter { get; set; }

    public virtual User? PerformedByNavigation { get; set; }
}
