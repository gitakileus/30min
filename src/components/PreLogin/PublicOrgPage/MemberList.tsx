import MemberListItem from './MemberListItem';
import MemberListItemManagement from './MemberListItemManagement';

const MemberList = ({members, isManagement, organizationDetails, userRole}) => (
  <>
    {members?.length > 0 && members !== null ? (
      members?.map((member, index) =>
        isManagement ? (
          <MemberListItemManagement
            userRole={userRole}
            member={member}
            key={index}
            organizationDetails={organizationDetails}
          />
        ) : (
          <MemberListItem member={member} key={index} />
        )
      )
    ) : (
      <li className='flex justify-center font-bold text-xl bg-white mb-2 rounded-md py-3 px-4 w-full'>
        No Results Found...
      </li>
    )}
  </>
);

export default MemberList;
