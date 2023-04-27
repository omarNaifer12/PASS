import React, { useContext } from 'react';
import { useSession } from '@inrupt/solid-ui-react';
import { runNotification, setDocContainerAclPermission } from '../../utils';
import { useField, useStatusNotification } from '../../hooks';
import FormSection from './FormSection';
import { SelectUserContext } from '../../contexts';

/**
 * SetAclPermsDocContainerForm Component - Component that generates the form for
 * setting ACL permissions to another user's Documents container in their Solid
 * Pod via Solid Session
 *
 * @memberof Forms
 * @name SetAclPermsDocContainerForm
 */

const SetAclPermsDocContainerForm = () => {
  const { session } = useSession();
  const { state, dispatch } = useStatusNotification();
  const { clearValue: clearUrl, ...user } = useField('text');
  const { selectedUser, setSelectedUser } = useContext(SelectUserContext);

  const clearInputFields = () => {
    clearUrl();
    setSelectedUser('');
    dispatch({ type: 'CLEAR_PROCESSING' });
  };

  // Event handler for setting ACL permissions to file container on Solid
  const handleAclPermission = async (event) => {
    event.preventDefault();
    dispatch({ type: 'SET_PROCESSING' });
    const permissionType = event.target.setAclPerms.value;
    let podUrl = event.target.setAclTo.value;

    if (!podUrl) {
      podUrl = selectedUser;
    }

    if (!podUrl) {
      runNotification('Set permissions failed. Reason: Pod URL not provided.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (`https://${podUrl}/` === String(session.info.webId.split('profile')[0])) {
      runNotification(
        'Set permissions failed. Reason: Current user Pod cannot change container permissions to itself.',
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    if (!permissionType) {
      runNotification('Set permissions failed. Reason: Permissions not set.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
      return;
    }

    try {
      await setDocContainerAclPermission(session, permissionType, podUrl);

      runNotification(
        `${permissionType} permission to ${podUrl} for Documents Container.`,
        5,
        state,
        dispatch
      );
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    } catch (error) {
      runNotification('Set permissions failed. Reason: File not found.', 5, state, dispatch);
      setTimeout(() => {
        clearInputFields();
      }, 3000);
    }
  };

  const formRowStyle = {
    margin: '20px 0'
  };

  return (
    <FormSection
      title="Permission to Documents Container"
      state={state}
      statusType="Permission status"
      defaultMessage="To be set..."
    >
      <form onSubmit={handleAclPermission} autoComplete="off">
        <div style={formRowStyle}>
          <label htmlFor="set-acl-to">Set permissions to (i.e., username.opencommons.net): </label>
          <br />
          <br />
          <input id="set-acl-to" size="60" name="setAclTo" {...user} placeholder={selectedUser} />
        </div>
        <div style={formRowStyle}>
          <p>Select permission setting:</p>
          <input type="radio" id="set-acl-perm-give" name="setAclPerms" value="Give" />
          <label htmlFor="set-acl-perm-give">Give</label>
          <input type="radio" id="set-acl-perm-revoke" name="setAclPerms" value="Revoke" />
          <label htmlFor="set-acl-perm-revoke">Revoke</label>
        </div>
        <button disabled={state.processing} type="submit">
          Set Permission
        </button>
      </form>
    </FormSection>
  );
};

export default SetAclPermsDocContainerForm;
