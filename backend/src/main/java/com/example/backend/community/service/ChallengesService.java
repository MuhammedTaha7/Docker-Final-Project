package com.example.backend.community.service;

import com.example.backend.community.dto.ChallengeDto;
import com.example.backend.community.dto.UserChallengeDto;
import com.example.backend.community.dto.request.CreateChallengeRequest;
import com.example.backend.community.dto.request.UpdateChallengeStatusRequest;
import com.example.backend.community.dto.request.SubmitChallengeRequest;
import java.util.List;

public interface ChallengesService {
    List<ChallengeDto> getAllChallenges(String category, String difficulty, String type);
    List<UserChallengeDto> getUserChallenges(String userId);
    ChallengeDto createChallenge(CreateChallengeRequest request, String userId);
    UserChallengeDto updateChallengeStatus(String challengeId, UpdateChallengeStatusRequest request, String userId);
    void submitChallenge(String challengeId, SubmitChallengeRequest request, String userId);
}