import { useEffect, useState } from 'react'
import { HandPalm, Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import { differenceInSeconds } from 'date-fns'

import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  StopCountdownButton,
  TaskInput,
} from './styles'

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Insira uma tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'Insira um valor maior que 5')
    .max(60, 'Insira um valor menor que 60'),
})

type newCycleFormValues = zod.infer<typeof newCycleFormValidationSchema>

interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interrumptedDate?: Date
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)
  const [secondsPassed, setSecondsPassed] = useState(0) // estado de quantos segundos ja se passaram

  const {
    register,
    handleSubmit,
    watch,
    reset: resetForm,
  } = useForm<newCycleFormValues>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  function handleCreatenewCycle(data: newCycleFormValues) {
    const newCycle: Cycle = {
      id: new Date().getTime().toString(),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setCycles((state) => [...state, newCycle])
    setActiveCycleId(newCycle.id)
    // resetar quantidade de segundos passados
    setSecondsPassed(0)

    resetForm() // reseta o formulario
  }

  // função para interromper o ciclo ativo
  function handleStopCycle() {
    setCycles((state) =>
      state.map((cycle) => {
        // se o ciclo ativo for o mesmo que o ciclo que esta sendo interrompido
        if (cycle.id === activeCycleId) {
          return {
            ...cycle,
            interrumptedDate: new Date(), // salva a data de interrupção
          }
        }

        return cycle // se não for o ciclo ativo, retorna o ciclo
      }),
    )

    setActiveCycleId(null) // seta o ciclo ativo como nulo

    // reseta o titulo da pagina
    document.title = 'Ignite Timer'
  }

  // pegar o ciclo ativo
  const activeCycle: Cycle | undefined = cycles.find(
    (cycle) => cycle.id === activeCycleId,
  )

  useEffect(() => {
    let interval: number

    if (activeCycle) {
      interval = setInterval(() => {
        setSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
    }

    // deletar o intervalo ativo
    return () => {
      clearInterval(interval)
    }
  }, [activeCycle])

  // pegar o total de segundos do ciclo ativo
  const activeCycleTotalSeconds = activeCycle
    ? activeCycle.minutesAmount * 60
    : 0
  const currentSeconds = activeCycle
    ? activeCycleTotalSeconds - secondsPassed
    : 0

  // pegar quantos minutos faltam
  const minutesLeft = Math.floor(currentSeconds / 60)
    .toString()
    .padStart(2, '0')
  const secondsLeft = (currentSeconds % 60).toString().padStart(2, '0')

  // colocar o countdown no titulo da pagina se o ciclo ativo existir
  useEffect(() => {
    if (activeCycle) {
      document.title = `${minutesLeft}:${secondsLeft}`
    }
  })

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreatenewCycle)} action="">
        <FormContainer>
          <label htmlFor="task">Vou trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycle}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Desenvolver um site" />
            <option value="Desenvolver um aplicativo" />
            <option value="jawdpwkdnwneknf" />
          </datalist>

          <label htmlFor="minutesAmount">durante</label>
          <MinutesAmountInput
            type="number"
            id="minutesAmount"
            placeholder="00"
            disabled={!!activeCycle}
            step={5}
            max={60}
            min={5}
            {...register('minutesAmount', {
              valueAsNumber: true,
            })}
          />

          <span>minutos</span>
        </FormContainer>

        <CountDownContainer>
          <span>{minutesLeft[0]}</span>
          <span>{minutesLeft[1]}</span>
          <Separator>:</Separator>
          <span>{secondsLeft[0]}</span>
          <span>{secondsLeft[1]}</span>
        </CountDownContainer>

        {activeCycle ? (
          <StopCountdownButton type="button" onClick={handleStopCycle}>
            <HandPalm size={24} />
            Parar
          </StopCountdownButton>
        ) : (
          <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
            <Play size={24} />
            Iniciar
          </StartCountdownButton>
        )}
      </form>
    </HomeContainer>
  )
}
