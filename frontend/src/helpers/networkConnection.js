import { useDispatch } from "react-redux";
import { initiateNetwork } from "../integration/web3Client";
import { clearData, setWalletData } from "../redux/counter/counterSlice";
import web3 from 'web3';
import { useState } from "react";


export const NetworkConnection = () => {
    const dispatch = useDispatch();
    const [wallet, setWallet] = useState(null);

      const connectNetwork = async () => {
        try {
            // dispatch(setLoading(true));
          const info = await initiateNetwork("metamask");
          // console.log(info, "Error check") 
          if (info instanceof Error) {
            alert(info.message)
            disconnectNetwork();
          } else if (info) {
            const { account, networkId } = info;
            console.log('Info data', info)
            if (validateNetwork(networkId)) {
          console.log(info, "Validate Error check")

                setWallet(account);
                dispatch(setWalletData({
                  account: info.account,
                  balance: info.balance,
                  chainId: info.networkId.toString(),
                  networkId: info.networkId.toString()
                }));

                // dispatch(setConnectAMENetwork(true));
                // dispatch(setLoading(false));
            } else {
              console.log("Disconnect 1")
              alert('Please check the Network');
              disconnectNetwork();
            }
          } else {
            console.log("Disconnect 1")

            alert('Please check the Network or Account');
            disconnectNetwork();
          }
        }
        catch (err) {
            disconnectNetwork();
            console.log("Error check", err);
        }
      }
      const disconnectNetwork = async () => {
        setWallet(pre => pre = null);
        logout();
        // dispatch(setConnectAMENetwork(false));
      }

      const logout = () => {
        dispatch(clearData());
        // dispatch(setLoading(false));
      };

      const validateNetwork = (networkId) => {
        const networks = {
          production: {
          },
          development: {
            80001: 'Polygon test newtork',
          }
        }
        return networks[process.env.REACT_APP_NODE_ENV][networkId]
      }
      return {
        // autoConnect,
        connectNetwork,
        disconnectNetwork,
        logout,
        validateNetwork,
        wallet
      }
}

export default NetworkConnection;