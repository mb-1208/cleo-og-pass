import './App.css';
import { useEffect, useState } from 'react'
import { ethers } from "ethers"
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useParams } from "react-router-dom";

function App() {
  const { ethereum } = window;
  let { id } = useParams();
  const [errorMessage, setErrorMessage] = useState(null);
  const [defaultAccount, setDefaultAccount] = useState(null);
  const [userBalance, setUserBalance] = useState(null);
  const [connButtonText, setConnButtonText] = useState("Connect Wallet");
  const [provider, setProvider] = useState(null);
  const [image, setImage] = useState([]);
  const [verifiedStatus, setVerifiedStatus] = useState('');

  const changeWallet = async () => {
    const accounts = await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [{
        eth_accounts: {}
      }]
    }).then(() => ethereum.request({
      method: 'eth_requestAccounts'
    }))

    const account = accounts[0]
    setDefaultAccount(account);
    setVerifiedStatus('');
    // console.log(account);
  }

  const connectWalletHandler = () => {
    if (window.ethereum && defaultAccount == null) {
      // set ethers provider
      setProvider(new ethers.providers.Web3Provider(window.ethereum));

      // connect to metamask
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          setConnButtonText("Wallet Connected");
          setDefaultAccount(result[0]);
        })
        .catch((error) => {
          setErrorMessage(error.message);
        });
    } else if (!window.ethereum) {
      console.log("Need to install MetaMask");
      setErrorMessage("Please install MetaMask browser extension to interact");
    }
  };

  const getNftWallet = async () => {
    try {
      const response = await axios.get('https://CleoOGPass.cleonfts.repl.co/nft-wallet', {
        params: {
          address: defaultAccount
        }
      });
      // console.log(response.data.nft.result);

      // let imageData = [];
      // for (var i = 0; i < foundValue.length; i++) {
      //   imageData.push(foundValue[i].metadata);
      // }
      // console.log(imageData);

      let obj = response.data.nft.result.find(o => o.token_address === "0x2953399124f0cbb46d2cbacd8a89cf0599974963");

      if (obj !== undefined) {
        // console.log('data exist');
        const body = {
          id: id,
        };
        const dcResponse = await axios.post("https://CleoOGPass.cleonfts.repl.co/", {
          body: body,
          headers: { "Content-Type": "application/json" },
        });
        await dcResponse;
        if (dcResponse.status === 400) {
          setVerifiedStatus('Something wrong, please try again!');
        } else {
          setVerifiedStatus("Verify Success");
        }
      } else {
        // console.log('data doesnt exist');
        setVerifiedStatus("You're not qualified");
      }
    } catch (err) {
      console.log(err);
    }
  }

  const getQuantity = async () => {
    const response = await axios.get('https://CleoOGPass.cleonfts.repl.co/nft-wallet', {
      params: {
        address: defaultAccount
      }
    });
    // console.log(response.data.nft.result);

    var foundValue = response.data.nft.result.filter(obj => obj.token_address === '0x2953399124f0cbb46d2cbacd8a89cf0599974963');
    // console.log(foundValue);
    setImage(foundValue);
  }

  useEffect(() => {
    if (defaultAccount) {
      provider.getBalance(defaultAccount).then((balanceResult) => {
        setUserBalance(ethers.utils.formatEther(balanceResult));
      });
      getQuantity();
    }
    // console.log(id);
  }, [defaultAccount]);

  if (id === undefined) {
    return (
      <div>
        <div className=''>
          <div className='container centered-flex' style={{ height: '100vh' }}>
            <div className="card text-center p-4">
              Access using discord verify
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className=''>
        <div className='container centered-flex' style={{ height: '100vh' }}>
          <div className="card text-center p-4">
            <h2 className="card-title" style={{fontWeight: 'bolder', color: '#4f9dc5'}}>CLEO OG PASS VERIFY</h2>
            {defaultAccount === null ?
              <button className="btn btn-primary" style={{ background: '#86d3f7', border: 'none' }} onClick={connectWalletHandler}>
                {connButtonText}
              </button>
              :
              <button className='btn btn-primary' style={{ background: '#86d3f7', border: 'none' }} onClick={changeWallet}>Change Wallet</button>
            }
            <hr></hr>
            <div className="accountDisplay">
              <h5>Wallet Address: </h5>
              <p>
                <i>{defaultAccount}</i>
              </p>
              {/* <div className="balanceDisplay">
                <b>Balance:</b>
                <p>{userBalance} Eth</p>
              </div> */}
              <span style={{ color: 'red' }}>{errorMessage}</span>
            </div>
            <div>
              <div class="row align-items-center">
                <div class="col">
                  <h1 className='display-1'>{image.length}</h1>
                  <span>NFT</span>
                </div>
                <div class="col">
                  <img style={{ width: '15vh' }} src='https://i.seadn.io/gcs/files/cb6fb736e851ffcac907b63b23d4ce46.gif?w=500&auto=format' />
                </div>
              </div>
            </div>
            {defaultAccount &&
              <button className='btn btn-primary mt-4' onClick={getNftWallet}>Get Role</button>
            }
            {/* {image.map((item, i) => {
              return (
                <div>
                  <img key={i} src='https://i.seadn.io/gcs/files/cb6fb736e851ffcac907b63b23d4ce46.gif?w=500&auto=format' />
                </div>
              )
            })} */}
            <span className='mt-2' style={{ fontWeight: 'bolder' }}>{verifiedStatus}</span>
          </div>
        </div>
        <p className='footer-c'>CLEONFT@2022 ALLL RIGHTS RESERVED</p>
        <div className='wave-set'>
          <svg className="waves" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 24 150 28" preserveAspectRatio="none" shapeRendering="auto">
            <defs>
              <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            </defs>
            <g className="parallax">
              <use xlinkHref="#gentle-wave" x="48" y="0" fill="rgba(255,255,255,0.7" />
              <use xlinkHref="#gentle-wave" x="48" y="3" fill="rgba(255,255,255,0.5)" />
              <use xlinkHref="#gentle-wave" x="48" y="5" fill="rgba(255,255,255,0.3)" />
              <use xlinkHref="#gentle-wave" x="48" y="7" fill="#fff" />
            </g>
          </svg>
        </div>
      </div>
    );
  }
}

export default App;
