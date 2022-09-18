export default function createStatementData (invoices, plays) {
    const statementData = {}
    statementData.customer = invoices.customer
    statementData.performances = invoices.performances.map(enrichPerformance)
    statementData.totalAmount = totalAmount(statementData)
    statementData.totalVolumeCredits = totalVolumeCredits(statementData)
    return statementData
    function enrichPerformance(aPerformance) {
        const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance))
        const result = Object.assign({},aPerformance)
        result.play = calculator.play
        result.amount = calculator.amount
        result.volumeCredits = calculator.volumeCredits
        return result
    }
    function createPerformanceCalculator(aPerformance, aPlay) {
        return new PerformanceCalculator(aPerformance, aPlay)
    }
    function playFor(aPerformance) {
        return plays[aPerformance.playID]
    }
    function totalVolumeCredits(data) {
        return data.performances.reduce((total, p)=> total + p.volumeCredits, 0)
    }
    function totalAmount(data) {
        return data.performances.reduce((total, p)=> total + p.amount, 0)
    }
}
class PerformanceCalculator {
    constructor(aPerformance, aPlay) {
        this.performance = aPerformance
        this.play = aPlay
    }
    get amount() {
        let result = 0
        
        switch(this.play.type) {
            case "tragedy": 
                result = 40000
                if(this.performance.audience > 30) {
                    result += 1000* (this.performance.audience - 30)
                }
                break
            case "comedy": 
                result = 30000
                if(this.performance.audience > 20) {
                    result += 10000 + 500 * (this.performance.audience -20)
                }
                result += 300 * this.performance.audience
                break
            default: 
                throw new Error(`unknow type: ${this.play.type}`)
        }
        return result
    }
    get volumeCredits() {
        let result = 0
        result += Math.max(this.performance.audience - 30, 0)
        if("comedy" === this.play.type) result += Math.floor(this.performance.audience/5)
        return result
    }
}