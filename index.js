const program = require('commander')
const fs = require('fs')
const variables = require('./variables')

program
    .command('file [file]')
    .action(async (file) => {

        const data = fs.existsSync(file) ? fs.readFileSync(file) : []
        const json = JSON.parse(data)

        if (json) {
            const funcionarios = json.funcionarios
            const areas = json.areas

            let max_sal_qt1 = funcionarios[0].salario
            let min_sal_qt1 = funcionarios[0].salario
            let global_avg_qt1 = funcionarios[0].salario

            let area_avg_qt2 = 0
            let area_max_qt2 = 0
            let area_min_qt2 = 999999
            let area_empl_qtd = 0

            let most_employees_qt3 = 0
            let least_employees_qt3 = 999999

            let last_name_qt4 = []
            let last_name_empl_qt4 = []
            let last_name_max = 0

            let tmp

            //Quem mais recebe e quem menos recebe na empresa e a média salarial da empresa.
            for (var i = 1; i < funcionarios.length; i++) {

                tmp = funcionarios[i]

                //somar todos os salário da empresa
                global_avg_qt1 += tmp.salario


                //verificar maior salário
                if (tmp.salario >= max_sal_qt1) {
                    max_sal_qt1 = tmp.salario
                }

                //verificar menor salário
                if (tmp.salario < min_sal_qt1) {
                    min_sal_qt1 = tmp.salario
                }


                tmp = null
            }

            // Quem mais recebe e quem menos recebe em cada área e a média salarial em cada área
            for (var i = 0; i < areas.length; i++) {

                for (var j = 0; j < funcionarios.length; j++) {

                    tmp = funcionarios[j]

                    if (tmp.area === areas[i].codigo) {

                        // somar salário dos funcionários da área atual
                        area_avg_qt2 += tmp.salario
                        area_empl_qtd += 1

                        //verificar maior salário da área atual
                        if (tmp.salario > area_max_qt2) {
                            area_max_qt2 = tmp.salario
                        }

                        //verificar menor salário da área atual
                        if (tmp.salario < area_min_qt2) {
                            area_min_qt2 = tmp.salario
                        }
                    }

                    tmp = null
                }

                for (var j = 0; j < funcionarios.length; j++) {

                    tmp = funcionarios[j]

                    if (tmp.area === areas[i].codigo) {
                        // verificar e imprimir o nome completo do(s) funcionário(s) com o(s) maior(es)
                        if (tmp.salario == area_max_qt2) {
                            console.log(`area_max|${areas[i].nome}|${tmp.nome} ${tmp.sobrenome}|${tmp.salario.toFixed(2)}`)
                        }
                        // verificar e imprimir o nome completo do(s) funcionário(s) com o(s) menor(es)
                        if (tmp.salario == area_min_qt2) {
                            console.log(`area_min|${areas[i].nome}|${tmp.nome} ${tmp.sobrenome}|${tmp.salario.toFixed(2)}`)
                        }
                    }

                    tmp = null
                }


                // Área(s) com o maior e menor número de funcionários - criação das váriaveis de comparação
                if (area_empl_qtd > most_employees_qt3) {
                    most_employees_qt3 = area_empl_qtd
                }
                if (area_empl_qtd < least_employees_qt3) {
                    least_employees_qt3 = area_empl_qtd
                }


                // saída: imprimir salário médio por área
                area_avg_qt2 = area_avg_qt2 / area_empl_qtd
                console.log(`area_avg|${areas[i].nome}|${area_avg_qt2.toFixed(2)}`)

                area_empl_qtd = 0
                area_avg_qt2 = 0

                area_max_qt2 = 0
                area_min_qt2 = 999999
            }

            // Área(s) com o maior e menor número de funcionários
            for (var i = 0; i < areas.length; i++) {

                let employees = 0

                for (var j = 0; j < funcionarios.length; j++) {
                    if (funcionarios[j].area === areas[i].codigo) {
                        employees += 1
                    }
                }

                if (most_employees_qt3 === employees) {
                    console.log(`most_employees|${areas[i].nome}|${employees}`)
                }

                if (least_employees_qt3 === employees) {
                    console.log(`least_employees|${areas[i].nome}|${employees}`)
                }

                employees = 0
            }


            // saídas
            for (var i = 0; i < funcionarios.length; i++) {

                tmp = funcionarios[i]

                // verificar quais funcionários possuem o salário igual ao maior salário
                if (tmp.salario == max_sal_qt1) {
                    console.log(`global_max|${tmp.nome} ${tmp.sobrenome}|${tmp.salario.toFixed(2)}`)
                }

                // verificar quais funcionários possuem o salário igual ao menor salário
                if (tmp.salario == min_sal_qt1) {
                    console.log(`global_min|${tmp.nome} ${tmp.sobrenome}|${tmp.salario.toFixed(2)}`)
                }


                // Maiores salários para funcionários com o mesmo sobrenome
                for (var j = 0; j < funcionarios.length; j++) {

                    if ((funcionarios[j].id != tmp.id) &&
                        (funcionarios[j].sobrenome === tmp.sobrenome)) {

                        last_name_qt4.push(funcionarios[i])

                        if (funcionarios[i].salario > last_name_max) {
                            last_name_max = funcionarios[i].salario
                        }

                    }
                }

                if (last_name_qt4.length) {
                    last_name_qt4.forEach(employee => {

                        if (employee.salario == last_name_max) {
                            if (!last_name_empl_qt4.find(e => e == employee)) {
                                last_name_empl_qt4.push(employee)
                            }
                        }

                    })
                }

                last_name_qt4 = []
                tmp = null

            }

            // Imprimir Maiores salários para funcionários com o mesmo sobrenome
            last_name_empl_qt4.forEach(employee => {
                console.log(`last_name_max|${employee.sobrenome}|${employee.nome} ${employee.sobrenome}|${employee.salario}`)
            })

            //  média salarial da empresa
            global_avg_qt1 = global_avg_qt1 / funcionarios.length
            console.log(`global_avg|${global_avg_qt1.toFixed(2)}`)

        } else {
            return false
        }
    })

program.parse(process.argv)

