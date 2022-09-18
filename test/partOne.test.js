import { statement } from "../PartOne/statement.js"
const plays = {
    hamlet: {
        name: "Hamlet",
        type: 'tragedy'
    },
    'as-like': {
        name: "As You Like It",
        type: 'comedy'
    },
    othello: {
        name: 'Othello',
        type: 'tragedy'
    }
}
const invoices = [
    {
        customer: 'BigCo',
        performances: [
            {
                playID:"hamlet",
                audience: 55
            },
            {
                playID:"as-like",
                audience: 35
            },
            {
                playID:"othello",
                audience: 40
            }
        ]
    }
]
test('测试statement函数返回结果是否正确', () => {
    expect(statement(invoices[0], plays)).toMatchSnapshot()
})