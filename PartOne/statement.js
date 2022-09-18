import createStatementData from "./createStatementData"
function statement(invoices, plays) {
    return renderPlainText(createStatementData(invoices,plays))
}

function htmlStatement(invoices,plays) {
    return renderHtml(createStatementData(invoices,plays))
}

function renderPlainText (data) {
    let result = `Statement for ${data.customer}\n`
    for(let perf of data.performances) {
        // print line for this order
        result += ` ${perf.play.name}: ${usd(perf.amount)} (${perf.audience} seats)\n`
    }
    result += `Amount owed is ${usd(data.totalAmount)}\n`
    result += `You earned ${data.totalVolumeCredits} credits\n`
    return result
}

function renderHtml(data) {
    let result = `<h1>Statement for ${data.customer}</h1> \n`
    result += `<table>\n`
    result += `<tr><th>play</th><th>seats</th><th>cost</th></th>`
    for(let perf of data.performances) {
        result += `<tr><td>${perf.play.name}</td><td>${perf.audience}</td>`
        result += `<td>${usd(perf.amount)}</td></tr>\n`
    }
    result += '</table>\n'
    result += `<p>Amount owed is <em>${usd(data.totalAmount)}</em></p>`
    result += `<p>You earned <em>${data.totalVolumeCredits}</em></p>`
    return result
}

function usd(aNumber) {
    return new Intl.NumberFormat("en-US", {style: 'currency', currency:"USD", minimumFractionDigits: 2}).format(aNumber/100)
}
export {statement, htmlStatement}