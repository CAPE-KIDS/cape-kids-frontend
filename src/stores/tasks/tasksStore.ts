import { create } from "zustand";
import { API } from "@/utils/api";
import { TaskSchemaWithTimelineType } from "@shared/tasks";
import { toast } from "sonner";
import { RestResponseSchemaType } from "@shared/apiResponse";
import { useAuthStore } from "../auth/useAuthStore";
import { ParticipantSchemaType } from "@shared/user";

interface TasksState {
  tasks: TaskSchemaWithTimelineType[];
  setTasks: (tasks: TaskSchemaWithTimelineType[]) => void;
  createTask: (
    data: TaskSchemaWithTimelineType
  ) => Promise<RestResponseSchemaType>;
  getUserTasks: (token: string) => Promise<RestResponseSchemaType>;
  getTaskById: (id: string) => Promise<RestResponseSchemaType>;
  selectedTask: TaskSchemaWithTimelineType | null;
  selectedTaskParticipants: ParticipantSchemaType[];
  setSelectedTask: (task: TaskSchemaWithTimelineType | null) => void;

  clearTasks: () => void;
}
export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  setTasks: (tasks: TaskSchemaWithTimelineType[]) => {
    set({ tasks });
  },
  selectedTask: null,
  selectedTaskParticipants: [],
  setSelectedTask: (task: TaskSchemaWithTimelineType | null) => {
    set({ selectedTask: task });
  },
  createTask: async (
    data: TaskSchemaWithTimelineType
  ): Promise<TaskSchemaWithTimelineType> => {
    const { authState } = useAuthStore.getState();
    const request = await fetch(API.CREATE_TASK, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authState.token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await request.json();
    if (response.error) {
      set({ selectedTask: null });
      return response;
    }
    set({ selectedTask: response.data });
    set({ tasks: [...get().tasks, response.data] });
    return response;
  },
  getUserTasks: async (token: string) => {
    const { tasks } = get();
    if (tasks.length > 0) return tasks;

    console.log("Fetching user tasks");
    try {
      const request = await fetch(API.GET_USER_TASKS, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const response = await request.json();

      if (response.error) {
        set({ tasks: [] });
        return tasks;
      }
      set({ tasks: response.data });
      return response.data;
    } catch (error) {
      set({ tasks: [] });
      toast.error("Error fetching tasks");
      return [];
    }
  },

  getTaskById: async (id: string) => {
    const { authState } = useAuthStore.getState();
    const request = await fetch(`${API.GET_TASK_BY_ID(id)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authState.token}`,
      },
    });

    const response = await request.json();
    return response;
  },

  clearTasks: () => set({ tasks: [], selectedTask: null }),
}));
