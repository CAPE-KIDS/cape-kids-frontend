const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const API = {
  // User
  LOGIN: `${API_URL}/auth/login`,
  REGISTER: `${API_URL}/auth/register`,
  // Experiments
  GET_EXPERIMENTS: `${API_URL}/experiments`,
  GET_USER_EXPERIMENTS: `${API_URL}/experiments/user-experiments`,
  CREATE_EXPERIMENT: `${API_URL}/experiments`,
  EXPERIMENT_BY_ID: (id: string) => `${API_URL}/experiments/${id}`,
  GENERATE_ACCESS_CODE: `${API_URL}/experiments/generate-access-code`,

  // Tasks
  GET_TASKS: `${API_URL}/tasks`,
  GET_USER_TASKS: `${API_URL}/tasks/user-tasks`,
  GET_TASK_BY_ID: (id: string) => `${API_URL}/tasks/${id}`,
  CREATE_TASK: `${API_URL}/tasks`,
  UPDATE_TASK: (id: string) => `${API_URL}/tasks/${id}`,
  // Experiment Participants
  GET_PARTICIPANTS: `${API_URL}/users/participants`,
  ADD_EXPERIMENT_PARTICIPANT: `${API_URL}/experiment-participants`,
  GET_EXPERIMENT_PARTICIPANTS: (experimentId: string) =>
    `${API_URL}/experiments/${experimentId}/participants`,
  JOIN_EXPERIMENT: `${API_URL}/experiment-participants/join`,
  REMOVE_PARTICIPANT_FROM_EXPERIMENT: (experimentId: string, userId: string) =>
    `${API_URL}/experiment-participants/${experimentId}/${userId}`,

  // Experiment Results
  SAVE_RESULTS: `${API_URL}/experiment-results`,

  // Timeline
  GET_TIMELINE_ID_BY_SOURCE_ID: (sourceId: string) =>
    `${API_URL}/timelines/source/${sourceId}`,
  UPDATE_CONNECTIONS: `${API_URL}/timelines/update-timeline-connections`,
  SAVE_STEP: `${API_URL}/timeline-steps`,
  UPDATE_STEP: (id: string) => `${API_URL}/timeline-steps/${id}`,
  DELETE_STEP: (id: string) => `${API_URL}/timeline-steps/${id}`,
  SAVE_CONNECTIONS: `${API_URL}/step-connections`,
};
