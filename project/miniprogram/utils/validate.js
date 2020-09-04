function isValidEmail (emailStr) {
  if (emailStr.endsWith('.com') && emailStr.indexOf('@') > 0 && /^\w+@[a-z0-9]+\.[a-z]{2,4}$/.test(emailStr)) {
    return true;
  }
  return false;
}
function isValidMobile(mobileStr) {
  if (mobileStr.length === 11 && !isNaN(mobileStr)) {
    return true;
  }
  return false;
}
module.exports = {
  isValidEmail: isValidEmail,
  isValidMobile: isValidMobile,
}