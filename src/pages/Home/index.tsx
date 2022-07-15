import { Play } from 'phosphor-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  CountDownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartCountdownButton,
  TaskInput,
} from './styles'

const newCountdownFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Insira uma tarefa'),
  minutesAmount: zod
    .number()
    .min(5, 'Insira um valor maior que 5')
    .max(60, 'Insira um valor menor que 60'),
})

type newCountdownFormValues = zod.infer<typeof newCountdownFormValidationSchema>

export function Home() {
  const { register, handleSubmit, watch, reset } =
    useForm<newCountdownFormValues>({
      resolver: zodResolver(newCountdownFormValidationSchema),
      defaultValues: {
        task: '',
        minutesAmount: 5,
      },
    })

  function handleCreateNewCountdown(data: newCountdownFormValues) {
    console.log(data)
    reset()
  }

  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCountdown)} action="">
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
          <span>0</span>
          <span>0</span>
          <Separator>:</Separator>
          <span>0</span>
          <span>0</span>
        </CountDownContainer>

        <StartCountdownButton type="submit" disabled={isSubmitDisabled}>
          <Play size={24} />
          Iniciar
        </StartCountdownButton>
      </form>
    </HomeContainer>
  )
}
