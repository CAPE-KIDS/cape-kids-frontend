const API_URL = `http://localhost:3000`;

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

  // Timeline
  SAVE_STEP: `${API_URL}/timeline-steps`,
};
