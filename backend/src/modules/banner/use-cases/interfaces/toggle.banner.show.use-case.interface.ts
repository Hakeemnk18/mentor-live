export interface IToggleBannerShowUseCase {
  execute(id: string, isShow: boolean, priority?: number): Promise<void>;
}
