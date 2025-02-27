export interface BaseUseCase<I, O> {
  execute(input: I): Promise<O>;
}

export interface BaseUseCaseWithoutInput<O> {
  execute(): Promise<O>;
}
