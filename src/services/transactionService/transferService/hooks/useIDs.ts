const useIDs = () => {
  const genID = (): number => {
    return Math.floor(1000000000 + Math.random() * 9000000000);
  };
  const genChatId = (): number => {
    return genID();
  };
  const genTransactionId = (): number => {
    return genID();
  };
  const genGiftId = (): number => {
    return genID();
  };
  const genRequestId = (): number => {
    return genID();
  };

  const confirmGift = (giftId: string | number): boolean => {
    return true;
  };

  const confirmRequest = (requestId: string | number): boolean => {
    return true;
  };

  return {
    genChatId,
    genTransactionId,
    genRequestId,
    genGiftId,
    confirmGift,
    confirmRequest,
  };
};

export default useIDs;
