using System;
using System.Collections.Generic;

namespace HotelBooking.Domain.Entities;

public partial class Role
{
    public sbyte RoleId { get; set; }

    public string RoleName { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; } = new List<User>();
}
