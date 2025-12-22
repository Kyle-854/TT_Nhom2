using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace HotelBooking.Application.Utilities
{
    public static class SlugGenerator
    {
        public static string GenerateSlug(string phrase)
        {
            if (string.IsNullOrWhiteSpace(phrase))
            {
                return string.Empty;
            }

            string str = phrase.ToLowerInvariant();

            str = RemoveDiacritics(str);
            str = str.Replace("đ", "d");
            str = Regex.Replace(str, @"[^a-z0-9\s-]", "");
            str = Regex.Replace(str, @"\s+", "-").Trim();
            str = Regex.Replace(str, @"-+", "-");

            return str.Trim('-');
        }

        private static string RemoveDiacritics(string text)
        {
            string? normalizedString = text.Normalize(NormalizationForm.FormD);
            StringBuilder stringBuilder = new StringBuilder();

            foreach (char c in normalizedString)
            {
                UnicodeCategory unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
                if (unicodeCategory != UnicodeCategory.NonSpacingMark)
                {
                    stringBuilder.Append(c);
                }
            }

            return stringBuilder.ToString().Normalize(NormalizationForm.FormC);
        }
    }
}
