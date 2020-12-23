import axios from 'axios'
module.exports = async (req, res) => {
  const { data } = await axios.get('https://conduit.productionready.io/api/tags')
  let html = '<ul>'
  data.tags.forEach(item => {
    html += `<li>${item}</li>`
  })
  html += '</ul>'
  res.status(200).send(html)
}