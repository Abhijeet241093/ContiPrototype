/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { Modal, Input, Tooltip, Button, message } from 'antd';
import _ from 'lodash'
import { CopyFilled, DownloadOutlined } from '@ant-design/icons';
import addAvalancheNetwork from '../../utilities/InjectAvalancheNetwork';
import { appStore } from '../../store/App.store';



export default function ModalError({ setClose }) {
  const { accountETHs, isCorrectNetwork } = appStore()
  const networks = [ 'test']
  const close = () => {

  }


  return (
    <>
      <Modal
        title={'Error Network'}
        visible={true}
        onOk={close}
        onCancel={close}
        // width={800}
        forceRender={true}
        footer={''}
        bodyStyle={{ padding: 15 }}
        closable={false}
      >

        <div style={{ width: '100%', height: '100%' }} >

          <Error />
          {(!isCorrectNetwork || accountETHs.length === 0) &&
            <div style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
              {networks.map((network) => (
                <Button
                className='bq-custom-button'
                  key={network}
                  onClick={() => addAvalancheNetwork(network)}
                  style={{ margin: 5 }}
                
                // extraClassnames={styles.boundaryButton}
                >
                  Connect to Avalanche {network} network
                </Button>
              ))}
            </div>
            
            
            }


        </div>
      </Modal>
    </>
  );
}

function Error() {
  const renderErrorActions = () => {
    return [
      'Check that you have MetaMask installed and unlocked',
      'Check that you have MetaMask set to an Avalanche network',
      'Refresh the page',
      'Click on "Connect Wallet"',
    ].map((action) => (
      <li key={action} className={'styles.errorAction'}>
        {action}
      </li>
    ))
  }

  return (
    <div  style={{padding:5}}>
      <div  style={{color:'red'}} >
        <h2>
          Something went wrong. Perform the following actions:
        </h2>

        <ul className={'errorActions'}>{renderErrorActions()}</ul>
      </div>
    </div>

  )
}
