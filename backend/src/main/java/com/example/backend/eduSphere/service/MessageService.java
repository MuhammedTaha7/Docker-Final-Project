package com.example.backend.eduSphere.service;

import com.example.backend.eduSphere.entity.Message;
import com.example.backend.eduSphere.dto.request.MessageRequest;
import com.example.backend.eduSphere.dto.request.MessageReplyRequest;
import com.example.backend.eduSphere.dto.response.MessageResponse;

import java.util.List;

public interface MessageService {

    List<MessageResponse> getReceivedMessages(String userId);

    List<MessageResponse> getSentMessages(String userId);

    MessageResponse getMessageById(String messageId, String userId);

    MessageResponse createMessage(MessageRequest messageRequest, String senderId, String senderName);

    MessageResponse replyToMessage(String messageId, MessageReplyRequest replyRequest, String replierId);

    List<MessageResponse> getAllMessages();
}