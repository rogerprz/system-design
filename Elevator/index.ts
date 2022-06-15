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

class Elevator {
  private currentDirection: Direction = Direction.UP;
  private currentState: State = State.IDLE;
  private currentFloor = 0;
  // Jobs that are currently being processed
  private currentJobs: ElevatorRequest[] = [];
  // Going up jobs that cannot be processed now and are put in the queue
  private upPendingJobs: ElevatorRequest[] = [];
  // Going down jobs that cannot be processed now and are put in the queue
  private downPendingJobs: ElevatorRequest[] = [];

  public startElevator(): void {
    const testValue = true;
    while (testValue) {
      console.log('Passing while');
      if (this.checkIfJob()) {
        if (this.currentDirection === Direction.UP) {
          const currentJob = this.currentJobs.shift();
          if (currentJob) this.processUpRequest(currentJob);
          if (this.currentJobs.length === 0) {
            this.addPendingDownJobsToCurrentJobs();
          }
        }
        if (this.currentDirection === Direction.DOWN) {
          const currentJob = this.currentJobs.pop();
          if (currentJob) this.processUpRequest(currentJob);
          if (this.currentJobs.length === 0) {
            this.addPendingUpJobsToCurrentJobs();
          }
        }
      }
    }
  }
  private processUpRequest(currentRequest: ElevatorRequest): void {
    const startFloor = this.currentFloor;
    const currentFloor = currentRequest.getExternalRequest().getSourceFloor();
    if (startFloor < currentFloor) {
      for (let i = startFloor; i <= currentFloor; i++) {
        setTimeout(() => {
          console.log('Process Up request');
        }, 1000);
        this.currentFloor = i;
        this.currentState = State.MOVING;
        this.currentDirection = Direction.UP;
        console.log('We have reached floor: ' + this.currentFloor);
      }
    }

    console.log('Reached floor: ' + this.currentFloor);
    this.currentState = State.IDLE;
    this.currentFloor = currentFloor;
    for (let i = startFloor; i <= currentFloor; i++) {
      setTimeout(() => {
        console.log('Floor reached');
      }, 1000);
      this.currentFloor = i;
      console.log('We have reached floor: ' + this.currentFloor);
      this.currentState = State.MOVING;
      this.currentDirection = Direction.UP;
      if (this.checkIfNewJobCanBeProcessed(currentRequest)) {
        break;
      }
    }
  }

  private checkIfNewJobCanBeProcessed(currentRequest: ElevatorRequest): boolean {
    if (this.checkIfJob()) {
      const request = this.currentJobs.shift();

      if (request) {
        const destinationFloor = request.getInternalRequest().getDestinationFloor();
        const currentRequestDestinationFloor = currentRequest.getInternalRequest().getDestinationFloor();
        if (this.currentDirection === Direction.UP) {
          if (destinationFloor < currentRequestDestinationFloor) {
            this.currentJobs.push(request);
            this.currentJobs.push(currentRequest);
            return true;
          }
          this.currentJobs.push(request);
        }

        if (this.currentDirection === Direction.DOWN) {
          if (destinationFloor > currentRequestDestinationFloor) {
            this.currentJobs.push(request);
            this.currentJobs.push(currentRequest);
            return true;
          }
          this.currentJobs.push(request);
        }
      }
    }
    return false;
  }

  private processDownRequest(currentRequest: ElevatorRequest): void {
    const startFloor = this.currentFloor;
    const currentFloor = currentRequest.getExternalRequest().getSourceFloor();
    if (startFloor > currentFloor) {
      for (let i = startFloor; i >= currentFloor; i--) {
        setTimeout(() => {
          console.log('process down request');
        }, 500);
        this.currentFloor = i;
        this.currentState = State.MOVING;
        this.currentDirection = Direction.DOWN;
        console.log('We have reached floor: ' + this.currentFloor);
      }
    }
  }

  private addPendingUpJobsToCurrentJobs(): void {
    if (this.downPendingJobs.length === 0) {
      this.currentState = State.IDLE;
    } else {
      this.currentJobs = this.downPendingJobs;
      this.currentDirection = Direction.DOWN;
    }
  }

  private addPendingDownJobsToCurrentJobs(): void {
    if (this.upPendingJobs.length === 0) {
      this.currentState = State.IDLE;
    } else {
      this.currentJobs = this.upPendingJobs;
      this.currentDirection = Direction.UP;
    }
  }

  public checkIfJob(): boolean {
    if (this.currentJobs) return true;
    return true;
  }
}

class ProcessJobWorker {
  private elevator: Elevator;

  constructor(elevator: Elevator) {
    this.elevator = elevator;
  }
  run() {
    // Start the elevator
    this.elevator.startElevator();
  }
}

class TestElevator {
  public static main(): void {
    const elevator = new Elevator();
    /*
     * Thread for starting the elevator
     */
    const processJobWorker = new ProcessJobWorker(elevator);
    processJobWorker.run();
    try {
      setTimeout(() => {
        console.log('Processing job');
      }, 1000);
    } catch (error) {
      console.log('Error: ' + error);
    }
  }

  external = new ExternalRequest(Direction.DOWN, 5);
  internal = new InternalRequest(0);
}

const testElevator = new TestElevator();
console.log('Starting the elevator');
// TestElevator.main();
