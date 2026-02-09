package com.portfolio.repository;

import com.portfolio.model.Advisory;
import com.portfolio.model.AdvisoryStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface AdvisoryRepository extends JpaRepository<Advisory, UUID> {

    Page<Advisory> findByProgrammerId(UUID programmerId, Pageable pageable);

    Page<Advisory> findByExternalId(UUID externalId, Pageable pageable);

    Page<Advisory> findByProgrammerIdAndStatus(UUID programmerId, AdvisoryStatus status, Pageable pageable);

    List<Advisory> findByProgrammerIdAndScheduledAtBetween(UUID programmerId, LocalDateTime start, LocalDateTime end);

    @Query("SELECT a FROM Advisory a WHERE a.programmer.id = :programmerId AND a.scheduledAt = :scheduledAt AND a.status IN ('PENDING', 'APPROVED')")
    List<Advisory> findConflictingAdvisories(UUID programmerId, LocalDateTime scheduledAt);

    @Query("SELECT a FROM Advisory a WHERE a.status = 'APPROVED' AND a.scheduledAt BETWEEN :start AND :end")
    List<Advisory> findUpcomingApprovedAdvisories(LocalDateTime start, LocalDateTime end);

    @Query("SELECT a.status, COUNT(a) FROM Advisory a GROUP BY a.status")
    List<Object[]> countByStatus();

    @Query("SELECT a.status, COUNT(a) FROM Advisory a WHERE a.programmer.id = :programmerId GROUP BY a.status")
    List<Object[]> countByStatusForProgrammer(UUID programmerId);

    @Query("SELECT FUNCTION('DATE', a.scheduledAt), COUNT(a) FROM Advisory a WHERE a.scheduledAt >= :since GROUP BY FUNCTION('DATE', a.scheduledAt) ORDER BY FUNCTION('DATE', a.scheduledAt)")
    List<Object[]> countByDateSince(LocalDateTime since);
}
