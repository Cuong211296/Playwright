// 123420 -> "123.420 ₫" (đúng định dạng giá trên web)
export function formatVnd(amount: number) {
  return `${amount.toLocaleString('vi-VN')} ₫`;
}

// Date -> "YYYY-MM-DD" theo giờ máy (định dạng của input type=date)
export function toISODate(date: Date) {
  return date.toLocaleDateString('sv-SE');
}
