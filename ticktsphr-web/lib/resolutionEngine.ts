export function generateResolution(category: string) {
  switch (category) {
    case "Oracle Procurement":
      return `
1. Verify approval hierarchy

2. Validate buyer assignment

3. Check procurement agent setup

4. Review approval rules

5. Retest requisition
`;

    case "Oracle Inventory":
      return `
1. Verify item setup

2. Check receiving parameters

3. Validate inventory organization

4. Validate transaction processing

5. Retest receipt transaction
`;

    case "Access Management":
      return `
1. Unlock account

2. Reset password

3. Verify assigned roles

4. Validate security groups

5. Retest login
`;

    case "Network":
      return `
1. Verify VPN connectivity

2. Check firewall rules

3. Validate network route

4. Review gateway logs

5. Retest connection
`;

    default:
      return `
Further investigation required.
`;
  }
}