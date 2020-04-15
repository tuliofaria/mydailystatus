export const getCurrentDate = () => {
  const today = new Date()
  const currentDate =
    today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate()
  return currentDate
}
