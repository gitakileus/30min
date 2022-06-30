import EventModal from 'components/shared/Modals/Elements/Event';
import PublicationModal from 'components/shared/Modals/Elements/Publication';
import EducationModal from 'components/shared/Modals/Elements/Education';
import JobHistoryModal from 'components/shared/Modals/Elements/JobHistory';
import ShareProfile from 'components/shared/Modals/Elements/ShareProfile';
import ChangeTime from 'components/shared/Modals/Elements/ChangeTime';
import Meetings from 'components/shared/Modals/Elements/MeetingModal';
import OrganizationModal from 'components/shared/Modals/Elements/Organization';
import OrganizationServiceCategory from 'components/shared/Modals/Elements/OrganizationServiceCategoryModal';
import Charity from 'components/shared/Modals/Elements/Charity';
import JoinOrganizationModal from 'components/shared/Modals/Elements/JoinOrganizationModal';
import OrgServiceModal from 'components/shared/Modals/Elements/OrgServiceModal';
import Delete from 'components/shared/Modals/Elements/Delete';
import Confirm from 'components/shared/Modals/Elements/Confirm';
import SignOut from 'components/shared/Modals/Elements/signOut';
import OrganizationInviteMembers from 'components/shared/Modals/Elements/OrganizationInviteModal';
import SendMessageExtension from 'components/shared/Modals/Elements/SendMessageExtension';
import KickOrganizationMember from 'components/shared/Modals/Elements/KickOrganizationMember';
import GiftExtensionModal from 'components/shared/Modals/Elements/GiftExtensionModal';
import CheckAvailability from 'components/shared/Modals/Elements/CheckAvailability';
import EditAvailabilityGroupTitle from 'components/shared/Modals/Elements/EditAvailabilityGroupTitle';

export const MODAL_TYPES = {
  EVENT: 'EVENT',
  PUBLICATION: 'PUBLICATION',
  JOBHISTORY: 'JOBHISTORY',
  EDUCATION: 'EDUCATION',
  SHAREPROFILE: 'SHAREPROFILE',
  CHANGETIME: 'CHANGETIME',
  MEETINGS: 'MEETINGS',
  CHARITY: 'CHARITY',
  ORGANIZATION: 'ORGANIZATION',
  ORGANIZATION_SERVICE_CATEGORY: 'ORGANIZATION_SERVICE_CATEGORY',
  JOIN_ORGANIZATION: 'JOIN_ORGANIZATION',
  PENDING_ORG_INVITES: 'PENDING_ORG_INVITES',
  ORG_SERVICE: 'ORG_SERVICE',
  DELETE: 'DELETE',
  CONFIRM: 'CONFIRM',
  SIGN_OUT: 'SIGN_OUT',
  ORG_INVITE_MEMBERS: 'ORG_INVITE_MEMBERS',
  SEND_MESSAGE_EXTENSION: 'SEND_MESSAGE_EXTENSION',
  KICK_ORGANIZATION_MEMBER: 'KICK_ORGANIZATION_MEMBER',
  GIFT_EXTENSION: 'GIFT_EXTENSION',
  CHECK_AVAILABILITY: 'CHECK_AVAILABILITY',
  EDIT_AVAILABILITY_GROUP_TITLE: 'EDIT_AVAILABILITY_GROUP_TITLE',
};

export const MODAL_COMPONENTS: any = {
  [MODAL_TYPES.EVENT]: EventModal,
  [MODAL_TYPES.EDUCATION]: EducationModal,
  [MODAL_TYPES.JOBHISTORY]: JobHistoryModal,
  [MODAL_TYPES.PUBLICATION]: PublicationModal,
  [MODAL_TYPES.SHAREPROFILE]: ShareProfile,
  [MODAL_TYPES.CHANGETIME]: ChangeTime,
  [MODAL_TYPES.MEETINGS]: Meetings,
  [MODAL_TYPES.CHARITY]: Charity,
  [MODAL_TYPES.ORGANIZATION]: OrganizationModal,
  [MODAL_TYPES.ORGANIZATION_SERVICE_CATEGORY]: OrganizationServiceCategory,
  [MODAL_TYPES.JOIN_ORGANIZATION]: JoinOrganizationModal,
  [MODAL_TYPES.ORG_SERVICE]: OrgServiceModal,
  [MODAL_TYPES.DELETE]: Delete,
  [MODAL_TYPES.CONFIRM]: Confirm,
  [MODAL_TYPES.SIGN_OUT]: SignOut,
  [MODAL_TYPES.ORG_INVITE_MEMBERS]: OrganizationInviteMembers,
  [MODAL_TYPES.SEND_MESSAGE_EXTENSION]: SendMessageExtension,
  [MODAL_TYPES.KICK_ORGANIZATION_MEMBER]: KickOrganizationMember,
  [MODAL_TYPES.GIFT_EXTENSION]: GiftExtensionModal,
  [MODAL_TYPES.CHECK_AVAILABILITY]: CheckAvailability,
  [MODAL_TYPES.EDIT_AVAILABILITY_GROUP_TITLE]: EditAvailabilityGroupTitle,
};
