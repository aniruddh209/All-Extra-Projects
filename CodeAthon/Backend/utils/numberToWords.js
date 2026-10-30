/**
 * Convert numerical Indian Rupees into words (Lakhs, Crores)
 * e.g., 119180 -> "One Lakh Nineteen Thousand One Hundred Eighty Rupees Only"
 */
export const numberToWords = (num) => {
  const a = [
    '',
    'One',
    'Two',
    'Three',
    'Four',
    'Five',
    'Six',
    'Seven',
    'Eight',
    'Nine',
    'Ten',
    'Eleven',
    'Twelve',
    'Thirteen',
    'Fourteen',
    'Fifteen',
    'Sixteen',
    'Seventeen',
    'Eighteen',
    'Nineteen',
  ];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const convertLessThanOneThousand = (n) => {
    let str = '';
    if (n >= 100) {
      str += a[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += b[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += a[n] + ' ';
    }
    return str.trim();
  };

  const integerPart = Math.floor(num);
  if (integerPart === 0) return 'Zero Rupees Only';

  let remaining = integerPart;
  let words = '';

  const crore = Math.floor(remaining / 10000000);
  remaining %= 10000000;
  if (crore > 0) {
    words += convertLessThanOneThousand(crore) + ' Crore ';
  }

  const lakh = Math.floor(remaining / 100000);
  remaining %= 100000;
  if (lakh > 0) {
    words += convertLessThanOneThousand(lakh) + ' Lakh ';
  }

  const thousand = Math.floor(remaining / 1000);
  remaining %= 1000;
  if (thousand > 0) {
    words += convertLessThanOneThousand(thousand) + ' Thousand ';
  }

  if (remaining > 0) {
    words += convertLessThanOneThousand(remaining) + ' ';
  }

  return words.trim() + ' Rupees Only';
};

export default numberToWords;
