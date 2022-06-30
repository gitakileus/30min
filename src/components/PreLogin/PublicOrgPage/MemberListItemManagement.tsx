import useOrganizations from 'components/PostLogin/Organizations/useOrganizations';
import DropDownComponent from 'components/shared/DropDownComponent';
import {convert} from 'html-to-text';
import Link from 'next/link';

const MemberListItemManagement = ({member, organizationDetails, userRole}) => {
  const {orgMethods} = useOrganizations(organizationDetails);

  const Roles = [
    {key: 'owner', value: 'owner'},
    {key: 'admin', value: 'admin'},
    {key: 'member', value: 'member'},
  ];

  const RoleDropDown = memberID => {
    const options = Roles.map(role => ({
      key: role.key,
      value: role.value,
    }));

    return (
      <DropDownComponent
        name={'role'}
        options={options}
        value={memberID?.role}
        onChange={e => {
          orgMethods.handleModifyRole(memberID?._id, e.target.value, organizationDetails?._id);
        }}
      />
    );
  };
  return (
    <li className='mt-4 grid overflow-hidden grid-cols-4 grid-rows-7 gap-2 grid-flow-row w-auto shadow-md overflow-y-auto'>
      <div className='box row-start-1 row-span-1 col-span-1'>
        <img
          src={
            member?.userId?.accountDetails.avatar
              ? member?.userId?.accountDetails.avatar
              : '/assets/default-profile.jpg'
          }
          alt='avatar'
          className='w-36 h-36 object-cover object-center'
        />
      </div>
      <div className='box col-start-2 col-span-3 w-full flex flex-col overflow-y-auto'>
        <h2 className='text-md font-bold text-black'>{member?.userId?.personalDetails?.name}</h2>
        <p className='line-clamp-3 text-sm text-gray-500 font-bold'>
          {member?.userId?.personalDetails?.headline}
        </p>
        <p className='line-clamp-4 text-xs'>
          {convert(member?.userId?.personalDetails?.description)}
        </p>
      </div>

      {userRole === 'owner' && <div className='col-start-1 col-span-1'>{RoleDropDown(member)}</div>}
      <div className='col-start-2 col-span-1'>
        {member?.role !== 'owner' && member?.role !== 'admin' ? (
          <button
            onClick={() => {
              orgMethods.handleKickModal(member?._id, organizationDetails._id);
            }}
            className='bg-mainBlue flex justify-center items-center px-5 py-2 border border-gray-300 shadow-sm text-sm font-light rounded-md text-white hover:bg-blue-700'
          >
            Kick
          </button>
        ) : null}
      </div>
      <div className='col-start-3 md:col-span-4 col-span-2 md:col-start-4 text-right px-2 py-2 text-mainBlue'>
        <Link href={`/${member?.userId?.accountDetails?.username}`} passHref>
          View Profile
        </Link>
      </div>
    </li>
  );
};
export default MemberListItemManagement;
