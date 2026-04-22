export interface Bank {
  id?: number
  bankCode?: string
  name: string
  fullname: string
  nameEN: string
  symbol: string
  icon: string
  color: string
}

export interface BankList {
  [key: string]: Bank
}

export const bankLists: BankList = {
  KBANK: {
    bankCode: "4",
    name: "กสิกรไทย",
    fullname: "ธนาคารกสิกรไทย",
    nameEN: "Kasikorn Bank",
    symbol: "KBANK",
    icon: "/icons/KBANK.png",
    color: "#1DA858"
  },
  SCB: {
    bankCode: "14",
    name: "ไทยพาณิชย์",
    fullname: "ธนาคารไทยพาณิชย์",
    nameEN: "The Siam Commercial Bank",
    symbol: "SCB",
    icon: "/icons/SCB.png",
    color: "#543186"
  },
  KTB: {
    bankCode: "6",
    name: "กรุงไทย",
    fullname: "ธนาคารกรุงไทย",
    nameEN: "Krungthai Bank",
    symbol: "KTB",
    icon: "/icons/KTB.png",
    color: "#1DA8E6"
  },
  BBL: {
    bankCode: "2",
    name: "กรุงเทพ",
    fullname: "ธนาคารกรุงเทพ",
    nameEN: "Bangkok Bank",
    symbol: "BBL",
    icon: "/icons/BBL.png",
    color: "#29449D"
  },
  BAY: {
    bankCode: "25",
    name: "กรุงศรีอยุธยา",
    fullname: "ธนาคารกรุงศรีอยุธยา",
    nameEN: "Krungsri Bank",
    symbol: "BAY",
    icon: "/icons/BAY.png",
    color: "#FFD51C"
  },
  TTB: {
    name: "ทีเอ็มบีธนชาต",
    fullname: "ธนาคารทีเอ็มบีธนชาต",
    nameEN: "TMBThanachart Bank",
    symbol: "TTB",
    icon: "/icons/TTB.png",
    color: "#0C55F2"
  },
  UOB: {
    bankCode: "24",
    name: "ยูโอบี",
    fullname: "ธนาคารยูโอบี",
    nameEN: "United Overseas Bank",
    symbol: "UOB",
    icon: "/icons/UOB.png",
    color: "#E41A26"
  },
  KKP: {
    name: "เกียรตินาคิน",
    fullname: "ธนาคารเกียรตินาคินภัทร",
    nameEN: "Kiatnakin Phatra Bank",
    symbol: "KKP",
    icon: "/icons/KKP.png",
    color: "#5A547C"
  },
  GSB: {
    bankCode: "30",
    name: "ออมสิน",
    fullname: "ธนาคารออมสิน",
    nameEN: "Government Savings Bank",
    symbol: "GSB",
    icon: "/icons/GSB.png",
    color: "#ED1891"
  },
  BAAC: {
    bankCode: "34",
    name: "ธ.ก.ส.",
    fullname: "ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร",
    nameEN: "Bank for Agriculture and Agricultural Cooperatives",
    symbol: "BAAC",
    icon: "/icons/BAAC.png",
    color: "#CCA41C"
  },
  CIMB: {
    name: "ซีไอเอ็มบี",
    fullname: "ธนาคารซีไอเอ็มบี",
    nameEN: "CIMB Thai Bank",
    symbol: "CIMB",
    icon: "/icons/CIMB.png",
    color: "#BD1325"
  },
  CITI: {
    bankCode: "17",
    name: "ซิตี้แบงก์",
    fullname: "ธนาคารซิตี้แบงก์",
    nameEN: "citibank",
    symbol: "CITI",
    icon: "/icons/CITI.png",
    color: "#0F3D89"
  },
  GHB: {
    bankCode: "33",
    name: "ธ.อ.ส.",
    fullname: "ธนาคารอาคารสงเคราะห์",
    nameEN: "GH Bank",
    symbol: "GHB",
    icon: "/icons/GHB.png",
    color: "#FF8614"
  },
  HSBC: {
    bankCode: "31",
    name: "เอชเอสบีซี",
    fullname: "ธนาคารเอชเอสบีซี",
    nameEN: "HSBC Bank",
    symbol: "HSBC",
    icon: "/icons/HSBC.png",
    color: "#FF1518"
  },
  IBANK: {
    bankCode: "66",
    name: "อิสลามแห่งประเทศไทย",
    fullname: "ธนาคารอิสลามแห่งประเทศไทย",
    nameEN: "Islamic Bank of Thailand",
    symbol: "IBANK",
    icon: "/icons/IBANK.png",
    color: "#164626"
  },
  ICBC: {
    name: "ไอซีบีซี",
    fullname: "ธนาคารไอซีบีซี",
    nameEN: "ICBC Thai Commercial Bank",
    symbol: "ICBC",
    icon: "/icons/ICBC.png",
    color: "#CD1511"
  },
  LHB: {
    name: "แลนด์ แอนด์ เฮ้าส์",
    fullname: "ธนาคารแลนด์ แอนด์ เฮ้าส์",
    nameEN: "LH Bank",
    symbol: "LHB",
    icon: "/icons/LHB.png",
    color: "#727375"
  },
  TCRB: {
    bankCode: "71",
    name: "ไทยเครดิต",
    fullname: "ธนาคารไทยเครดิต",
    nameEN: "Thai Credit Bank",
    symbol: "TCRB",
    icon: "/icons/TCRB.png",
    color: "#FF7813"
  },
  TISCO: {
    bankCode: "67",
    name: "ทิสโก้",
    fullname: "ธนาคารทิสโก้",
    nameEN: "Tisco Bank",
    symbol: "TISCO",
    icon: "/icons/TISCO.png",
    color: "#267CBC"
  },
  PromptPay: {
    name: "พร้อมเพย์",
    fullname: "พร้อมเพย์",
    nameEN: "PromptPay",
    symbol: "PromptPay",
    icon: "/icons/PromptPay.png",
    color: "#0C4370"
  },
  TrueMoney: {
    name: "ทรูมันนี่",
    fullname: "ทรูมันนี่",
    nameEN: "True Money",
    symbol: "TrueMoney",
    icon: "/icons/TrueMoney.png",
    color: "#EE252B"
  }
} 


type BankItem = {
  bankCode?: string
  name: string
  fullname: string
  nameEN: string
  symbol: string
  icon: string
  color: string
}

const bankListsByCode = Object.values(bankLists).reduce<Record<string, BankItem>>(
  (acc, bank) => {
    if (bank.bankCode) {
      acc[bank.bankCode] = bank
    }
    return acc
  },
  {}
)
export { bankListsByCode }