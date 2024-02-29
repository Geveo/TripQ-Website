import { Container, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

function HotelsList() {
  const navigate = useNavigate();

  const onPageChange = async (pageNo) => {
    //setShowLoadPopup(true);
   // refreshList(pageNo);
  }

//   const handleSort = (columnName) => {
//     if (columnName === sortColumn) {
//       setSortOrder (sortOrder === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortColumn(columnName);
//       setSortOrder('asc');
//     }
//   }

//   const sortData = (data) => {
//     if (sortColumn) {
//       return data.slice().sort((a, b) => {
//         const aValue = a[sortColumn];
//         const bValue = b[sortColumn];

//         if (sortColumn === 'teamCount' || sortColumn === 'participantCount') {
//           // Convert values to numbers for numeric comparison
//           const numericAValue = parseFloat(aValue);
//           const numericBValue = parseFloat(bValue);

//           // If both values are numeric, perform numeric comparison
//           if (sortOrder === 'asc') {
//             return numericAValue - numericBValue;
//           } else {
//             return numericBValue - numericAValue;
//           }
//         } else {
//           // If one or both values are not numeric, fallback to string comparison
//           if (sortOrder === 'asc') {
//             return aValue.localeCompare(bValue);
//           } else {
//             return bValue.localeCompare(aValue);
//           }
//         }
//       });
//     }
//     return data;
//   };
  
  const fetchData = async (pageNo) => {
     // _challengeService.getAllChallenges(pageNo)
        // .then((response) => {
        //   if (response) {
        //     setChallengesList(response.data);
        //     setNoOfPages(response.totalPages);
        //     setCurrentPage(response.page);
        //     setShowLoadPopup(false);
        //   } else {
        //     setShowLoadPopup(false);
        //   }
        // })
        // .catch((error) => {
        //   setShowLoadPopup(false);
          
        // });
    
  };

//   const refreshList = async (pageNo) => {
//     const scConStatus = localStorage.getItem("sc-con-status");
//     if (scConStatus === null) {
//       .init()
//       .then(async (isConnected) => {
//         localStorage.setItem("sc-con-status", isConnected.toString());
//         if (isConnected) {
//           fetchData(pageNo);
//         } else {
//           setShowLoadPopup(false);
//           await Alert.fire({
//             icon: 'error',
//             title: 'Oops...',
//             text: "Something went wrong!",
//             confirmButtonColor: '#23d856',
//           }).then((result) => {
//             if (result.isConfirmed) {
//               navigate(`/`);
//             }
//           });
//         }
//       });
//     } else if (scConStatus === "true") {
//         await fetchData(pageNo);
//       } else {
//         setShowLoadPopup(false);
//         await Alert.fire({
//           icon: 'error',
//           title: 'Oops...',
//           text: "Something went wrong!",
//           confirmButtonColor: '#23d856',
//         }).then((result) => {
//           if (result.isConfirmed) {
//             navigate(`/`);
//           }
//         });
//       }
//   }

//   useEffect(() => {
//     refreshList(1);
//   }, []);

  return (
    <>
      {/* <LoadingScreen showLoadPopup={showLoadPopup} /> */}
      <Container fluid className="bg-white rounded">
        <Table striped responsive>
          <thead>
            <tr>
              
            </tr>
          </thead>
          <tbody>
            {/* {sortData(challengesList).map((challenge) => (
              <tr key={challenge.Id}>
                <td>{_dateService.getThemedDate(challenge.CreatedOn)}</td>
                <td><Link className="link-style" to={`/challenge/${challenge.Id}`}>{challenge.Name}</Link></td>
                <td>{_dateService.getThemedDate(challenge.StartDate)} - {_dateService.getThemedDate(challenge.EndDate)}</td>
                <td  style={{textAlign: 'center'}}>{challenge.teamCount}</td>
                <td  style={{textAlign: 'center'}}  >{challenge.participantCount}</td>
                {(() => {
                  switch (challenge.Status) {
                    case 'Ongoing':
                      return <td><FontAwesomeIcon icon={faPersonRunning} color="rgb(91, 178, 249)" style={{marginRight: '2px'}}/>
                        &nbsp;{challenge.Status}
                      </td>
                    case 'Pending':
                      return <td><FontAwesomeIcon icon={faHourglassHalf} color="orange" style={{marginRight: '5px'}}/>
                        &nbsp;{challenge.Status}
                      </td>
                    case 'Completed':
                      return <td><FontAwesomeIcon icon={faCheckCircle} color="#23d856"/>
                        &nbsp;{challenge.Status}
                      </td>
                    case 'Deleted':
                      return <td style={{color: 'red'}}>{challenge.Status}</td>
                    default:
                      break;
                  }
                })()}
              </tr>
            ))} */}
          </tbody>
        </Table>
      </Container><br />
    </>
  );
}

export default HotelsList;
