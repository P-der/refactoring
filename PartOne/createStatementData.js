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
        switch(aPlay.type)  {
            case "tragedy": 
                return new TragedyCalcuator(aPerformance, aPlay)
            case "comedy": 
                return new ComedyCalcuator(aPerformance, aPlay)
            default: 
                throw new Error(`unknow type: ${aPlay.type}`)
        }
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
        throw new Error('subclass responsibility')
    }
    get volumeCredits() {
        let result = 0
        result += Math.max(this.performance.audience - 30, 0)
        return result
    }
}

class TragedyCalcuator extends PerformanceCalculator {
    get amount() {
        let result = 40000
        if(this.performance.audience > 30) {
            result += 1000* (this.performance.audience - 30)
        }
        return result
    }
}
class ComedyCalcuator extends PerformanceCalculator {
    get amount() {
        let result = 30000
        if(this.performance.audience > 20) {
            result += 10000 + 500 * (this.performance.audience -20)
        }
        result += 300 * this.performance.audience
        return result
    }
    get volumeCredits() {
        return super.volumeCredits + Math.floor(this.performance.audience/5)
    }
}