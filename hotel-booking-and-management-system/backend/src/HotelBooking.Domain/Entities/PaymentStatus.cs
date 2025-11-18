using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class PaymentStatus
{
    public sbyte PaymentStatusId { get; set; }

    public string StatusName { get; set; } = null!;

    public virtual ICollection<PaymentTransaction> PaymentTransactions { get; set; } = new List<PaymentTransaction>();
}
