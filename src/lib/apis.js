const { baseUrl } = require('../config/config');

const ajax = async url => {
  return await fetch(url).then(res => res.json());
}

export default class Apis {
  static fetchBlocks = (start = 0,length = 10) => ajax(`${baseUrl}/block/?start=${start}&length=${length}`);
  static fetchTransactions = (start = 0,length = 10) => ajax(`${baseUrl}/transaction/?start=${start}&length=${length}`);
}