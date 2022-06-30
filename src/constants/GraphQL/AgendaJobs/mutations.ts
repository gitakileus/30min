import {gql} from '@apollo/client';

const scheduleAgendaJob = gql`
  mutation ScheduleAgendaJob($agendaJobData: AgendaJobDataInput) {
    scheduleAgendaJob(agendaJobData: $agendaJobData) {
      message
      status
    }
  }
`;

const mutations = {
  scheduleAgendaJob,
};

export default mutations;
