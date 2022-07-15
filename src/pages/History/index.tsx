import { HistoryContainer, HistoryList, Status } from './sytles'

export function History() {
  return (
    <HistoryContainer>
      <h1>Histórico</h1>

      <HistoryList>
        <table>
          <thead>
            <tr>
              <th>Tarefa</th>
              <th>Duração</th>
              <th>Início</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Desenvolver um site</td>
              <td>45 minutos</td>
              <td>Há dois meses</td>
              <td>
                <Status statusColor="green">Concluído</Status>
              </td>
            </tr>
            <tr>
              <td>Desenvolver um aplicativo</td>
              <td>55 minutos</td>
              <td>Há um mês</td>
              <td>
                <Status statusColor="yellow">Pendente</Status>
              </td>
            </tr>
            <tr>
              <td>Desenvolver um aplicativo</td>
              <td>55 minutos</td>
              <td>Há um mês</td>
              <td>
                <Status statusColor="red">Interrompido</Status>
              </td>
            </tr>
          </tbody>
        </table>
      </HistoryList>
    </HistoryContainer>
  )
}
