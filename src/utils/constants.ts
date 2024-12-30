// Regular expression to validate domain names
export const DOMAIN_REGEX = /^(?!\-)(?!.*\-$)([a-zA-Z0-9\-]{1,63}\.)+[a-zA-Z]{2,}$/;
// Pattern to match URLs in the script content
export const URL_PATTERN = /https?:\/\/[^\s]+/g; 

// Regular expression to validate URLs protocols: http or https
export const URL_REGEX = /^https?:\/\//i;