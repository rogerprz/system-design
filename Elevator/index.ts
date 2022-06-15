class ExternalRequest {
  private directionToGo: Direction;
  private sourceFloor: number;

  constructor(directionToGo: Direction, sourceFloor: number) {
    this.directionToGo = directionToGo;
    this.sourceFloor = sourceFloor;
  }

  public getDirectionToGo(): Direction {
    return this.directionToGo;
  }

  public setDirectionToGo(directionToGo: Direction): void {
    this.directionToGo = directionToGo;
  }

  public getSourceFloor(): number {
    return this.sourceFloor;
  }

  public setSourceFloor(sourceFloor: number): void {
    this.sourceFloor = sourceFloor;
  }
}

class InternalRequest {
  private destinationFloor: number;

  constructor(destinationFloor: number) {
    this.destinationFloor = destinationFloor;
  }

  public getDestinationFloor(): number {
    return this.destinationFloor;
  }

  public setDestinationFloor(destinationFloor: number): void {
    this.destinationFloor = destinationFloor;
  }
}

class ElevatorRequest {
  private internalRequest: InternalRequest;
  private externalRequest: ExternalRequest;

  constructor(internalRequest: InternalRequest, externalRequest: ExternalRequest) {
    this.internalRequest = internalRequest;
    this.externalRequest = externalRequest;
  }

  public getInternalRequest(): InternalRequest {
    return this.internalRequest;
  }

  public setInternalRequest(internalRequest: InternalRequest): void {
    this.internalRequest = internalRequest;
  }

  public getExternalRequest(): ExternalRequest {
    return this.externalRequest;
  }
  public setExternalRequest(externalRequest: ExternalRequest): void {
    this.externalRequest = externalRequest;
  }

  public compare(elevatorRequest: ElevatorRequest): boolean {
    if (this.internalRequest.getDestinationFloor() === elevatorRequest.getInternalRequest().getDestinationFloor()) {
      return true;
    }
    if (
      this.externalRequest.getDirectionToGo() === elevatorRequest.getExternalRequest().getDirectionToGo() &&
      this.externalRequest.getSourceFloor() === elevatorRequest.getExternalRequest().getSourceFloor()
    ) {
      return true;
    }
    return false;
  }
}

enum State {
  MOVING,
  IDLE,
  STOPPED
}

enum Direction {
  UP,
  DOWN
}
