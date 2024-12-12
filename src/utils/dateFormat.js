/**
 * Converts a JavaScript Date object or a string to a formatted date string.
 * @param {Date|string|null} date - The date to convert.
 * @param {string} format - The desired format (default: "YYYY-MM-DD").
 * @returns {string} - Formatted date string or an empty string if invalid.
 */
export const formatDate = (date, format = "YYYY-MM-DD") => {
    if (!date) return "";
  
    // If the input is a string, convert it to a Date object
    const parsedDate = typeof date === "string" ? new Date(date) : date;
  
    if (isNaN(parsedDate.getTime())) return ""; // Invalid date check
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
    const day = String(parsedDate.getDate()).padStart(2, "0");
  
    if (format === "YYYY-MM-DD") {
      return `${year}-${month}-${day}`;
    }
    
    // Add support for other formats if needed
    return `${day}/${month}/${year}`; // Example for DD/MM/YYYY
  };
  