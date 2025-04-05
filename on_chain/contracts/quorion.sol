// SPDX-License-Identifier: MIT
// Specifies the license for the code (MIT is common and permissive)
pragma solidity ^0.8.20; // Use Solidity compiler version 0.8.20 or compatible (up to 0.9.0)

// Import necessary building blocks from the OpenZeppelin library
import "@openzeppelin/contracts/access/AccessControl.sol"; // For managing roles (admin, validator)
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title QuorionManager
 * @dev Manages data collection missions, user submissions, validation, and rewards for Quorion Market.
 */
contract QuorionManager is AccessControl, ReentrancyGuard {
    // Inherits features from AccessControl (role management) and ReentrancyGuard (security)

    // --- Roles ---
    // Define unique identifiers for roles using hashing
    bytes32 public constant VALIDATOR_ROLE = keccak256("VALIDATOR_ROLE");
    // AccessControl provides DEFAULT_ADMIN_ROLE automatically (for managing roles)

    // --- Constants ---
    // Define the max reward pool size (10,000 FTN)
    uint256 public constant MAX_REWARD_POOL = 100000 ether;

    // --- State Variables ---
    // Replace Counters with simple uint256
    uint256 private _nextMissionId = 1;
    uint256 private _nextSubmissionId = 1;

    // --- Structs ---

    // Defines the possible states for a submission
    enum SubmissionStatus {
        Pending, // Newly submitted, awaiting validation
        Accepted, // Approved by a validator
        Rejected // Rejected by a validator
    }

    // Groups all the information related to a data collection mission
    struct Mission {
        uint256 id; // Unique identifier
        address creator; // Professional who created the mission
        string instructionsUrl; // URL to detailed instructions document
        string dataType; // Description of data needed (e.g., "image/png", "text/csv")
        uint256 rewardPerSubmission; // FTN amount (in wei) per accepted submission
        uint256 totalRewardPool; // Initial FTN funding (in wei)
        uint256 remainingPool; // FTN currently available for rewards (in wei)
        bool isActive; // Controls if submissions are currently allowed
        uint256 submissionCount; // Total number of submissions received for this mission
        uint256 acceptedSubmissionCount; // Number of accepted submissions for this mission
    }

    // Groups all the information related to a single data submission
    struct Submission {
        uint256 id; // Unique identifier
        uint256 missionId; // ID of the mission this submission belongs to
        address submitter; // User who submitted the data
        string[] imageUrls; // Array of image URLs for the submission
        uint256 timestamp; // Time when the submission was made (block timestamp)
        SubmissionStatus status; // Current status (Pending, Accepted, Rejected)
        address validator; // Validator who reviewed the submission (if validated)
        uint256 validationTimestamp; // Time of validation (block timestamp)
    }

    // --- State Variables (Mappings) ---

    // Look up Mission details by mission ID
    mapping(uint256 => Mission) public missions; // missionId => Mission struct

    // Look up Submission details by submission ID
    mapping(uint256 => Submission) public submissions; // submissionId => Submission struct

    // Keep track of which submissions belong to which mission
    // Useful for displaying all submissions for a specific mission
    mapping(uint256 => uint256[]) public missionSubmissions; // missionId => array of submissionIds

    // Keep track of which submissions were made by which user
    // Useful for displaying a user's submission history
    mapping(address => uint256[]) public userSubmissions; // userAddress => array of submissionIds

    // --- Events ---
    // Events signal that something important happened on-chain. Off-chain apps listen for these.

    event ValidatorAdded(address indexed account);
    event ValidatorRemoved(address indexed account);
    event MissionCreated(
        uint256 indexed missionId,
        address indexed creator,
        string instructionsUrl,
        string dataType,
        uint256 rewardPerSubmission,
        uint256 totalRewardPool
    );
    event MissionStatusChanged(uint256 indexed missionId, bool isActive);
    event DataSubmitted(
        uint256 indexed submissionId,
        uint256 indexed missionId,
        address indexed submitter,
        string[] imageUrls
    );
    event SubmissionValidated(
        uint256 indexed submissionId,
        address indexed validator,
        SubmissionStatus status
        // string annotationCID // Optional, if adding annotations
    );
    event RewardPaid(
        uint256 indexed submissionId,
        address indexed submitter,
        uint256 amount
    );

    // --- Constructor ---
    /**
     * @dev Sets up the contract when it's deployed.
     */
    constructor() {
        // Grant the deployer the admin role automatically.
        // The deployer can then assign validator roles etc.
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender); // msg.sender is the address deploying the contract
        // Grant the deployer the validator role initially as well for testing/setup ease
        _grantRole(VALIDATOR_ROLE, msg.sender);
        emit ValidatorAdded(msg.sender);
    }

    // --- Role Management Functions ---
    /**
     * @dev Grants the VALIDATOR_ROLE to an account. Only callable by an admin.
     */
    function addValidator(
        address _account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(VALIDATOR_ROLE, _account);
        emit ValidatorAdded(_account); // Emit the event
    }

    /**
     * @dev Revokes the VALIDATOR_ROLE from an account. Only callable by an admin.
     */
    function removeValidator(
        address _account
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(VALIDATOR_ROLE, _account);
        emit ValidatorRemoved(_account); // Emit the event
    }

    /**
     * @dev Checks if an account has the VALIDATOR_ROLE.
     */
    function isValidator(address _account) external view returns (bool) {
        return hasRole(VALIDATOR_ROLE, _account);
    }

    // --- Interface Support (Required by AccessControl) ---
    function supportsInterface(
        bytes4 interfaceId
    ) public view virtual override(AccessControl) returns (bool) {
        return
            interfaceId == type(IAccessControl).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    // --- Mission Management ---

    /**
     * @notice Creates a new data collection mission.
     * @dev Requires the caller to send the total reward pool amount in FTN.
     * @param _instructionsUrl URL to mission instructions document.
     * @param _dataType Description of the required data type (e.g., "image/jpeg").
     * @param _rewardPerSubmission FTN amount (in wei) paid for each accepted submission.
     * @return missionId The ID of the newly created mission.
     */
    function createMission(
        string memory _instructionsUrl,
        string memory _dataType,
        uint256 _rewardPerSubmission
    ) external payable nonReentrant returns (uint256 missionId) {
        // --- Input Validation ---
        require(
            bytes(_instructionsUrl).length > 0,
            "Quorion: Instructions URL required"
        );
        require(bytes(_dataType).length > 0, "Quorion: Data type required");
        require(_rewardPerSubmission > 0, "Quorion: Reward must be positive");
        require(
            msg.value <= MAX_REWARD_POOL,
            "Quorion: Reward pool exceeds maximum limit"
        );
        require(
            msg.value >= _rewardPerSubmission,
            "Quorion: Total pool must cover at least one reward"
        );

        // --- Create and Store Mission ---
        missionId = _nextMissionId++;

        missions[missionId] = Mission({
            id: missionId,
            creator: msg.sender,
            instructionsUrl: _instructionsUrl,
            dataType: _dataType,
            rewardPerSubmission: _rewardPerSubmission,
            totalRewardPool: msg.value,
            remainingPool: msg.value,
            isActive: true,
            submissionCount: 0,
            acceptedSubmissionCount: 0
        });

        // --- Emit Event ---
        emit MissionCreated(
            missionId,
            msg.sender,
            _instructionsUrl,
            _dataType,
            _rewardPerSubmission,
            msg.value
        );

        return missionId;
    }

    /**
     * @notice Allows the mission creator or an admin to activate/deactivate a mission.
     * @dev Deactivated missions do not accept new submissions.
     * @param _missionId The ID of the mission to modify.
     * @param _isActive The desired status (true for active, false for inactive).
     */
    function setMissionActiveStatus(
        uint256 _missionId,
        bool _isActive
    ) external {
        // Use a storage pointer for efficiency when modifying state
        Mission storage mission = missions[_missionId];
        // Check if the mission actually exists (creator address will be non-zero)
        require(mission.creator != address(0), "Quorion: Mission not found");

        // Authorization check: Only creator or admin can change status
        require(
            msg.sender == mission.creator ||
                hasRole(DEFAULT_ADMIN_ROLE, msg.sender),
            "Quorion: Not authorized to change status"
        );

        // Only update and emit event if the status is actually changing
        if (mission.isActive != _isActive) {
            mission.isActive = _isActive;
            emit MissionStatusChanged(_missionId, _isActive);
        }
    }

    // --- Submission Handling ---

    /**
     * @notice Submits data (via array of image URLs) to a specific mission.
     * @dev Can only be called if the mission exists and is active.
     * @param _missionId The ID of the mission to submit data to.
     * @param _imageUrls Array of URLs pointing to the submitted images.
     * @return submissionId The ID of the newly created submission.
     */
    function submitData(
        uint256 _missionId,
        string[] memory _imageUrls
    ) external nonReentrant returns (uint256 submissionId) {
        // --- Get Mission & Validate ---
        Mission storage mission = missions[_missionId];
        require(mission.creator != address(0), "Quorion: Mission not found"); // Check mission exists
        require(
            mission.isActive,
            "Quorion: Mission is not active, cannot submit"
        ); // Check mission accepts submissions
        require(
            _imageUrls.length > 0,
            "Quorion: At least one image URL required"
        ); // Check URLs are provided

        // --- Create and Store Submission ---
        submissionId = _nextSubmissionId++;

        submissions[submissionId] = Submission({
            id: submissionId,
            missionId: _missionId,
            submitter: msg.sender,
            imageUrls: _imageUrls,
            timestamp: block.timestamp,
            status: SubmissionStatus.Pending,
            validator: address(0),
            validationTimestamp: 0
        });

        // --- Update Tracking Mappings ---
        missionSubmissions[_missionId].push(submissionId);
        userSubmissions[msg.sender].push(submissionId);
        mission.submissionCount++;

        // --- Emit Event ---
        emit DataSubmitted(submissionId, _missionId, msg.sender, _imageUrls);

        return submissionId;
    }

    // --- Validation ---

    /**
     * @notice Allows a whitelisted validator to accept or reject a submission.
     * @dev If accepted and sufficient funds remain in the mission's pool,
     * pays the reward in native FTN tokens to the submitter.
     * @param _submissionId The ID of the submission to validate.
     * @param _accept True to accept the submission, false to reject it.
     */
    function validateSubmission(
        uint256 _submissionId,
        bool _accept
    ) external nonReentrant onlyRole(VALIDATOR_ROLE) {
        Submission storage submission = submissions[_submissionId];
        require(
            submission.submitter != address(0),
            "Quorion: Submission not found"
        );
        require(
            submission.status == SubmissionStatus.Pending,
            "Quorion: Submission already validated"
        );

        Mission storage mission = missions[submission.missionId];
        require(
            mission.creator != address(0),
            "Quorion: Associated mission not found"
        );

        submission.validator = msg.sender;
        submission.validationTimestamp = block.timestamp;

        if (_accept) {
            submission.status = SubmissionStatus.Accepted;
            mission.acceptedSubmissionCount++;

            emit SubmissionValidated(
                _submissionId,
                msg.sender,
                SubmissionStatus.Accepted
            );

            if (mission.remainingPool >= mission.rewardPerSubmission) {
                mission.remainingPool -= mission.rewardPerSubmission;

                (bool success, ) = submission.submitter.call{
                    value: mission.rewardPerSubmission
                }("");
                require(success, "Quorion: FTN transfer failed");

                emit RewardPaid(
                    _submissionId,
                    submission.submitter,
                    mission.rewardPerSubmission
                );
            }
        } else {
            submission.status = SubmissionStatus.Rejected;
            emit SubmissionValidated(
                _submissionId,
                msg.sender,
                SubmissionStatus.Rejected
            );
        }
    }

    // --- Getter Functions (Read-Only) ---

    /**
     * @notice Gets the full details for a specific mission.
     * @param _missionId The ID of the mission to query.
     * @return Mission struct containing all mission details.
     */
    function getMission(
        uint256 _missionId
    ) external view returns (Mission memory) {
        return missions[_missionId];
    }

    /**
     * @notice Gets the full details for a specific submission.
     * @param _submissionId The ID of the submission to query.
     * @return Submission struct containing all submission details.
     */
    function getSubmission(
        uint256 _submissionId
    ) external view returns (Submission memory) {
        return submissions[_submissionId];
    }

    /**
     * @notice Gets the list (array) of submission IDs for a specific mission.
     * @param _missionId The ID of the mission.
     * @return An array of uint256 submission IDs.
     */
    function getSubmissionsForMission(
        uint256 _missionId
    ) external view returns (uint256[] memory) {
        return missionSubmissions[_missionId];
    }

    /**
     * @notice Gets the list (array) of submission IDs submitted by a specific user.
     * @param _user The address of the user.
     * @return An array of uint256 submission IDs.
     */
    function getSubmissionsByUser(
        address _user
    ) external view returns (uint256[] memory) {
        return userSubmissions[_user];
    }

    /**
     * @notice Returns the total balance of FTN tokens currently held by this contract.
     * @dev This includes funds across all active mission pools.
     * @return The FTN balance of this contract (in wei).
     */
    function getContractFTNBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @notice Returns the total number of missions created so far.
     * @return The next mission ID minus 1.
     */
    function getMissionCount() external view returns (uint256) {
        return _nextMissionId - 1;
    }

    /**
     * @notice Returns the total number of submissions created so far across all missions.
     * @return The next submission ID minus 1.
     */
    function getSubmissionCount() external view returns (uint256) {
        return _nextSubmissionId - 1;
    }

    // --- Fallback Functions ---
    receive() external payable {
        // Allow receiving FTN
    }

    fallback() external payable {
        revert("Quorion: Function does not exist");
    }

    function emergencyWithdrawFTN(
        address payable _to,
        uint256 _amount
    ) external onlyRole(DEFAULT_ADMIN_ROLE) nonReentrant {
        require(_to != address(0), "Quorion: Invalid withdrawal address");
        require(
            _amount > 0 && _amount <= address(this).balance,
            "Quorion: Invalid or insufficient amount for withdrawal"
        );

        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Quorion: Emergency FTN withdrawal failed");
    }
}
