import { useEffect, useState } from 'react'
import { Play } from 'phosphor-react'
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

    resetForm() // reseta o formulario
  }

  // pegar o ciclo ativo
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  useEffect(() => {
    if (activeCycle) {
      setInterval(() => {
        setSecondsPassed(differenceInSeconds(new Date(), activeCycle.startDate))
      }, 1000)
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

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Iniciar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
