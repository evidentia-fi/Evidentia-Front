import React, { PropsWithChildren } from 'react';

import ComingSoon from '@workspace/ui/components/Modals/coming-soon';
import CreateBondModal from '@workspace/ui/components/Modals/create-bond';
import RedeemModal from '@workspace/ui/components/Modals/redeem';
import RepayModal from '@workspace/ui/components/Modals/repay';
import SetAllowanceModal from '@workspace/ui/components/Modals/set-allowance-bond';
import StatusModal from '@workspace/ui/components/Modals/status';
import SupplyModal from '@workspace/ui/components/Modals/supply';
import WithdrawModal from '@workspace/ui/components/Modals/withdraw';
import { Emodal, useModalState } from '@workspace/ui/stores/use-modal-state';

const ModalsProvider = ({ children }: PropsWithChildren) => {
  const open = useModalState(state => state.open);

  return (
    <>
      {open === Emodal.ComingSoon && <ComingSoon />}
      {open === Emodal.Status && <StatusModal />}
      {open === Emodal.Supply && <SupplyModal />}
      {open === Emodal.Withdraw && <WithdrawModal />}
      {open === Emodal.Repay && <RepayModal />}
      {open === Emodal.CreateBond && <CreateBondModal />}
      {open === Emodal.Redeem && <RedeemModal />}
      {open === Emodal.SetAllowance && <SetAllowanceModal />}
      {children}
    </>
  );
};

export default ModalsProvider;
