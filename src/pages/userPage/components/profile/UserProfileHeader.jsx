import PropTypes from 'prop-types';

import { MdLogout } from 'react-icons/md';
import { FaRegEdit } from 'react-icons/fa';

import ToolTip from '../../../../components/tooltip/ToolTip';
import './userProfile.scss';

export default function UserProfileHeader({
    userImg,
    username,
    onToggleEdit,
    onLogout,
}) {
    return (
        <div className="userData">
            <div className="user">
                <img src={userImg} alt="user" />
                <h3>{username}</h3>
            </div>

            <div className="userConfig">
                <ToolTip message="Editar Perfil">
                    <FaRegEdit className="profileIcon" onClick={onToggleEdit} />
                </ToolTip>

                <ToolTip message="Sair da Conta">
                    <MdLogout className="profileIcon" onClick={onLogout} />
                </ToolTip>
            </div>
        </div>
    );
}

UserProfileHeader.propTypes = {
    userImg: PropTypes.string,
    username: PropTypes.string.isRequired,
    onToggleEdit: PropTypes.func.isRequired,
    onLogout: PropTypes.func.isRequired,
};
