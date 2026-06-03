export function calculateEMI(
  loanAmount: number,
  annualRate: number,
  tenureYears: number,
) {
  const monthlyRate = annualRate / 12 / 100;

  const months = tenureYears * 12;

  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
    (Math.pow(1 + monthlyRate, months) - 1);

  return Math.round(emi);
}
